# Códigos de error de Cauce 2xxx: conectores

Los códigos de la familia 2xxx vienen de un conector, el componente que mueve mensajes entre Cauce y un sistema externo. Se corrigen en el conector, no en el mensaje.

## CAU-2001

Vencieron las credenciales del conector. El conector se detiene y conserva su posición. Renová las credenciales en el almacén de secretos y reiniciá el conector; sigue donde se detuvo. No reintentes los mensajes a mano. Severidad: alta.

## CAU-2002

El sistema externo rechazó las credenciales del conector: existen pero les falta un permiso. Pedile el permiso que falta al dueño del sistema externo. Reiniciar no sirve hasta que cambie el permiso. Severidad: alta.

## CAU-2011

La configuración del conector no es válida después de un cambio. Cauce sigue con la configuración anterior. Corregí el cambio y aplicalo de nuevo. Severidad: baja.

## CAU-2012

Dos conectores reclaman el mismo origen. El segundo queda inactivo. Borrá el conector duplicado. Severidad: baja.

## CAU-2021

El conector perdió su archivo de posición y no puede saber dónde seguir. Se detiene en lugar de adivinar. Restaurá la posición desde el último checkpoint, o pedile al equipo de plataforma que la fije; nunca lo reinicies desde el principio sin decidirlo. Severidad: alta.

## CAU-2022

Un operador pausó el conector. No se pierde nada mientras está pausado. Reanudalo cuando el operador lo confirme. Severidad: baja.
