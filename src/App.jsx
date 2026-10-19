
import { useState, useMemo } from "react";
import "./app.css";
const products = [
["PI002","Postres Individuales","Tiramisú Clásico",5500,"Capas de café, mascarpone y cacao.","/images/tiramisu.jpg",false],

["PSA001","Productos Sin Azúcar","Torta Sin Azúcar de Naranja",48000,"Torta ligera endulzada naturalmente.","/images/torta-naranja.jpg",true],

["PSA002","Productos Sin Azúcar","Cheesecake Sin Azúcar",47000,"Cheesecake suave y cremoso.","/images/cheesecake.jpg",true],

["PT001","Pastelería Tradicional","Empanada de Manzana",3000,"Rellena de manzanas especiadas.","/images/empanada-manzana.jpg",false],

["PT002","Pastelería Tradicional","Tarta de Santiago",6000,"Tarta tradicional de almendras, azúcar y huevos.","/images/tarta-santiago.jpg",false],

["PG001","Productos Sin Gluten","Brownie Sin Gluten",4000,"Brownie rico y denso sin gluten.","/images/brownie-sin-gluten.jpg",false],

["PG002","Productos Sin Gluten","Pan Sin Gluten",3500,"Pan suave y esponjoso.","/images/pan-sin-gluten.jpg",false],

["PV001","Productos Vegana","Torta Vegana de Chocolate",50000,"Torta de chocolate sin productos de origen animal.","/images/torta-vegana.jpg",true],

["PV002","Productos Vegana","Galletas Veganas de Avena",4500,"Galletas crujientes de avena.","/images/galletas-veganas.jpg",false],

["TE001","Tortas Especiales","Torta Especial de Cumpleaños",55000,"Personalizable con decoraciones y mensajes únicos.","/images/torta-cumpleanos.jpg",true],

["TE002","Tortas Especiales","Torta Especial de Boda",60000,"Torta elegante diseñada para bodas.","/images/torta-boda.jpg",true]

];

const money = n => new Intl.NumberFormat("es-CL", {style:"currency", currency:"CLP", maximumFractionDigits:0}).format(n);

  

function ProductCard({product,onDetails,onAdd}) { return <article className="card"><div className="cake"><img src={product[5]} alt={product[2]} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} /></div><div className="card-body"><span className="tag">{product[1]}</span><h3>{product[2]}</h3><p className="desc">{product[4]}</p><div className="price">{money(product[3])}</div><div className="actions"><button onClick={()=>onDetails(product)}>Ver detalle</button><button className="add" onClick={()=>onAdd(product[0])}>Agregar</button></div></div></article>; }

  

function Dialog({product,onClose,onAdd}) { const [message,setMessage]=useState(""); if(!product)return null; return <div className="modal-wrap" role="dialog"><div className="dialog-card"><button className="close" onClick={onClose}>✕</button><span className="tag">{product[1]}</span><h2>{product[2]}</h2><p>{product[4]}</p><h3>{money(product[3])}</h3>{product[6]&&<label>Mensaje especial<input maxLength="60" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ej: ¡Feliz cumpleaños!"/></label>}<button className="primary full" onClick={()=>{onAdd(product[0],message);onClose();}}>Agregar al carrito</button><div className="notice">Comparte este producto con tus amigos después de agregarlo.</div></div></div>; }

  

function Cart({cart,onChange,onRemove,onCheckout,onClose}) { const subtotal=cart.reduce((s,x)=>s+products.find(p=>p[0]===x.id)[3]*x.qty,0); return <><div className="cart-panel open"><div className="cart-head"><h2>Tu carrito</h2><button onClick={onClose}>✕</button></div><div>{cart.length?cart.map((x,i)=>{const p=products.find(p=>p[0]===x.id);return <div className="cart-row" key={i}><div><b>{p[2]}</b>{x.message&&<small><br/>Mensaje: {x.message}</small>}<br/>{money(p[3])}</div><div className="qty"><button onClick={()=>onChange(i,-1)}>−</button>{x.qty}<button onClick={()=>onChange(i,1)}>+</button><button onClick={()=>onRemove(i)}>🗑</button></div></div>;}):<p>Tu carrito está vacío.</p>}</div><div className="totals"><div>Subtotal <b>{money(subtotal)}</b></div><div>Descuento <b>{money(0)}</b></div><div className="grand">Total <b>{money(subtotal)}</b></div></div><button className="primary full" onClick={onCheckout}>Confirmar pedido</button></div><div className="overlay show" onClick={onClose}/></>; }

  

function BakeryApp(){

const [cart,setCart]=useState([]),[search,setSearch]=useState(""),[category,setCategory]=useState(""),[cartOpen,setCartOpen]=useState(false),[selected,setSelected]=useState(null);

const categories=useMemo(()=>[...new Set(products.map(p=>p[1]))],[]);

const filtered=useMemo(()=>{const q=search.toLowerCase();return products.filter(p=>(!category||p[1]===category)&&p[2].toLowerCase().includes(q));},[search,category]);

const add=(id,message="")=>{setCart(c=>{const i=c.findIndex(x=>x.id===id&&x.message===message);return i>=0?c.map((x,j)=>j===i?{...x,qty:x.qty+1}:x):[...c,{id,qty:1,message}];});setCartOpen(true);};

const change=(i,d)=>setCart(c=>c.map((x,j)=>j===i?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0));

const removeItem=i=>setCart(c=>c.filter((_,j)=>j!==i));

const checkout=()=>{if(!cart.length)return alert("Agrega al menos un producto.");const age=prompt("Prototipo: ingresa tu edad (opcional). Si no aplica, deja vacío:");const code=prompt("Código promocional (opcional):");const subtotal=cart.reduce((s,x)=>s+products.find(p=>p[0]===x.id)[3]*x.qty,0);let disc=0,reasons=[];if(Number(age)>50){disc=Math.max(disc,subtotal*.5);reasons.push("50% por edad");}if((code||"").trim().toUpperCase()==="FELICES50"){disc=Math.max(disc,subtotal*.1);reasons.push("10% FELICES50");}alert(`Pedido confirmado (simulado)\nSubtotal: ${money(subtotal)}\nDescuento: ${money(disc)}${reasons.length?" ("+reasons.join(", ")+")":""}\nTotal: ${money(subtotal-disc)}\nEstado: Recibido\nEntrega: fecha a coordinar`);setCart([]);setCartOpen(false);};

const count=cart.reduce((s,x)=>s+x.qty,0);

return <><header><div className="topbar"><div className="brand">1000 Sabores</div><nav><a href="#catalogo">Catálogo</a><a href="#beneficios">Beneficios</a><a href="#historia">Historia</a></nav><button className="cart-btn" onClick={()=>setCartOpen(true)}>🛒 Carrito <span>{count}</span></button></div><div className="hero"><div><p className="eyebrow">50 años endulzando Chile</p><h1>Tradición que se comparte.</h1><p>Compra tortas y repostería, personaliza tu pedido y recibe beneficios especiales.</p><a className="primary" href="#catalogo">Ver productos</a></div><div className="hero-card"><span>🍰</span><strong>Hasta 50% OFF</strong><small>para clientes mayores de 50 años</small></div></div></header><main><section id="beneficios" className="benefits"><div><b>🎉 +50 años</b><span>50% de descuento</span></div><div><b>💗 FELICES50</b><span>10% de descuento</span></div><div><b>🎓 Estudiantes Duoc</b><span>Beneficio de cumpleaños*</span></div></section><section id="catalogo"><div className="section-head"><div><p className="eyebrow">Nuestros productos</p><h2>Catálogo</h2></div><div className="tools"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto..."/><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div></div><div className="grid">{filtered.map(p=><ProductCard key={p[0]} product={p} onDetails={setSelected} onAdd={add}/>)}</div></section><section id="historia" className="story"><div><p className="eyebrow">Nuestra historia</p><h2>50 años de dulzura</h2><p>Pastelería 1000 Sabores celebra su trayectoria en la repostería chilena, conectando recetas tradicionales con creatividad y nuevas experiencias digitales.</p></div><div className="story-box">🍪<br/><b>Calidad · Tradición · Comunidad</b></div></section></main>{cartOpen&&<Cart cart={cart} onChange={change} onRemove={removeItem} onCheckout={checkout} onClose={()=>setCartOpen(false)}/>}<Dialog product={selected} onClose={()=>setSelected(null)} onAdd={add}/><footer><p>Pastelería 1000 Sabores · Prototipo académico</p><small>Los pagos, boletas y seguimiento son simulados en esta versión.</small></footer></>;

}

  
  

function AuthScreen({ onLogin }) {

const [mode, setMode] = useState("login");

const [name, setName] = useState("");

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

const [confirm, setConfirm] = useState("");

const [error, setError] = useState("");

const [showPassword, setShowPassword] = useState(false);

  

const submit = (event) => {

event.preventDefault();

setError("");

const normalizedEmail = email.trim().toLowerCase();

  

if (!normalizedEmail || !password) {

setError("Completa tu correo y contraseña.");

return;

}

  

let users = [];

try {

users = JSON.parse(localStorage.getItem("pasteleria_users") || "[]");

} catch {

users = [];

}

  

if (mode === "register") {

if (!name.trim()) return setError("Ingresa tu nombre.");

if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

if (password !== confirm) return setError("Las contraseñas no coinciden.");

if (users.some((user) => user.email === normalizedEmail)) {

return setError("Ya existe una cuenta con ese correo. Inicia sesión.");

}

const user = { name: name.trim(), email: normalizedEmail, password };

localStorage.setItem("pasteleria_users", JSON.stringify([...users, user]));

onLogin({ name: user.name, email: user.email });

return;

}

  

const user = users.find((item) => item.email === normalizedEmail && item.password === password);

if (!user) return setError("Correo o contraseña incorrectos. Si aún no tienes cuenta, regístrate.");

onLogin({ name: user.name, email: user.email });

};

  

return (

<main className="auth-page">

<section className="auth-decoration">

<div className="auth-brand">1000 Sabores<span>✦</span></div>

<div className="auth-illustration" aria-hidden="true">🍰</div>

<p className="eyebrow">50 años endulzando Chile</p>

<h1>Un momento dulce comienza aquí.</h1>

<p>Entra a tu cuenta para descubrir tus favoritos, personalizar tus pedidos y disfrutar nuestros beneficios.</p>

<div className="auth-pills"><span>♡ Repostería artesanal</span><span>✧ Hecho para compartir</span></div>

</section>

<section className="auth-form-side">

<div className="auth-card">

<a className="auth-back" href="#inicio" onClick={(e) => e.preventDefault()}>PASTELERÍA · 1000 SABORES</a>

<div className="auth-tabs" role="tablist" aria-label="Acceso a la cuenta">

<button type="button" className={mode === "login" ? "active" : ""} onClick={() => {setMode("login");setError("");}}>Iniciar sesión</button>

<button type="button" className={mode === "register" ? "active" : ""} onClick={() => {setMode("register");setError("");}}>Crear cuenta</button>

</div>

<h2>{mode === "login" ? "¡Qué bueno verte!" : "Únete a nuestra mesa"}</h2>

<p className="auth-subtitle">{mode === "login" ? "Ingresa tus datos para continuar." : "Crea tu cuenta y endulza tus momentos."}</p>

<form onSubmit={submit}>

{mode === "register" && <label className="auth-label">Nombre completo<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required /></label>}

<label className="auth-label">Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.cl" required /></label>

<label className="auth-label">Contraseña<div className="password-wrap"><input type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required /><button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Ocultar" : "Ver"}</button></div></label>

{mode === "register" && <label className="auth-label">Repite tu contraseña<input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirma tu contraseña" minLength={6} required /></label>}

{error && <p className="auth-error" role="alert">{error}</p>}

<button className="primary auth-submit" type="submit">{mode === "login" ? "Iniciar sesión →" : "Crear mi cuenta →"}</button>

</form>

<p className="auth-switch">{mode === "login" ? "¿Todavía no tienes cuenta?" : "¿Ya tienes una cuenta?"} <button type="button" onClick={() => {setMode(mode === "login" ? "register" : "login");setError("");}}>{mode === "login" ? "Regístrate" : "Inicia sesión"}</button></p>

<p className="auth-privacy">Al continuar aceptas que esta es una demostración académica.</p>

</div>

</section>

</main>

);

}

  

export default function App() {

const [user, setUser] = useState(() => {

try { return JSON.parse(sessionStorage.getItem("pasteleria_session") || "null"); }

catch { return null; }

});

  

const login = (nextUser) => {

sessionStorage.setItem("pasteleria_session", JSON.stringify(nextUser));

setUser(nextUser);

};

const logout = () => {

sessionStorage.removeItem("pasteleria_session");

setUser(null);

};

  

if (!user) return <AuthScreen onLogin={login} />;

return <div className="logged-in-app">

<div className="user-bar"><span>Hola, <b>{user.name}</b> 👋</span><button type="button" onClick={logout}>Cerrar sesión</button></div>

<BakeryApp />

</div>;

}