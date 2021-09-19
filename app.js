//Definicion de variables
const url='http://localhost:3000/api/articulos/';
const contenedor=document.querySelector('tbody');
let resultados='';

const modalArticulo = new bootstrap.Modal(document.getElementById('modalarticulo'));
const formArticulo=document.querySelector("form");
const descripcion=document.getElementById("descripcion");
const precio=document.getElementById("precio");
const stock=document.getElementById("stock");
let opcion='';

btnCrear.addEventListener('click',()=>{
    modalTitleArticulos.innerHTML=``;
    descripcion.value='';
    precio.value='';
    stock.value='';
    modalArticulo.show();
    opcion="crear";
    modalTitleArticulos.innerHTML+=`${opcion.charAt(0).toLocaleUpperCase()+opcion.slice(1)} articulo`;
});

//funcionpara mostrar los resultados
const mostrar=articulos=>{
    articulos.forEach(element=>resultados+=`
<tr>
    <td>${element.id}</td>
    <td>${element.descripcion}</td>
    <td>${element.precio}</td>
    <td>${element.stock}</td>
    <td class="text-center"><button class="btnEditar btn btn-primary">Editar</button><button class="btnBorrar btn btn-danger">Borrar</button></td>
</tr>
`)
contenedor.innerHTML=resultados;
}


//Procedimiento mostrar
fetch(url)
    .then(response=>response.json())
    .then(data=>mostrar(data))
    .catch(err=>console.log(err));

//metodo on de jquery en vanilla javascript
const on=(element,event,selector,handler)=>{
 element.addEventListener(event,e=>{
        if(e.target.closest(selector)){
          handler(e);
        }
    })
}

//procedimiento borrar
on(document,'click','.btnBorrar',e=>{
  const fila=e.target.parentNode.parentNode;
    const id=fila.firstElementChild.innerHTML;
  console.log(id);

alertify.confirm("¿Quiere borrar este elemento?",
  function(){
    fetch(url+id,{
        method:'delete',
        mode:'cors',
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response=>response.json())
    .then(()=>location.reload())
    .catch(err=>console.log(err));
    //alertify.success('El elemento se borro');
  },
  function(){
    alertify.error('Cancel');
  });

})


//Procedimiento Editar
let idForm=0;
on(document,'click','.btnEditar',e=>{ 
    modalTitleArticulos.innerHTML=``;
    const fila=e.target.parentNode.parentNode;
    idForm=fila.children[0].innerHTML;
    const descripcionForm=fila.children[1].innerHTML;
    const precioForm=fila.children[2].innerHTML;
    const stockForm=fila.children[3].innerHTML;
    descripcion.value=descripcionForm;
    precio.value=precioForm;
    stock.value=stockForm;
    modalArticulo.show();
    opcion="editar";
    modalTitleArticulos.innerHTML=`${opcion.charAt(0).toLocaleUpperCase()+opcion.slice(1)} articulo`;
})

formArticulo.addEventListener('submit',e=>{
    e.preventDefault();
  const data= descripcion.value&&precio.value&&stock.value?{descripcion:descripcion.value,precio:precio.value,stock:stock.value}:"Ingrese todos los datos";
    if(data==="Ingrese todos los datos"){
        alertify.error(data);
        return
    }
  switch(opcion){
        case 'crear':
            fetch(url,{
                method:'post',
                mode:'cors',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            }).then(response=>response.json())
            .then(data=>location.reload())
            .catch(err=>console.log(`ocurrio un error:${err}`))
            break;
        case 'editar':
            fetch(url+idForm,{
                method:'put',
                mode:'cors',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then(response=>response.json())
            .then(data=>location.reload())
            break;
    }
    modalArticulo.hide();
})