function valid(event){
    var pas = document.getElementById('Passwd').value 
    var cpas = document.getElementById('CPasswd').value
    for(i=0;i < cpas.length; i++)
    {
     if(pas[i] != cpas[i] && event.keyCode != 8) {
       alert('Passwords did not match :(');
       document.getElementById('submit').disabled=true; 
       } else {
       document.getElementById('submit').disabled=false; 
       }
     }
    }     