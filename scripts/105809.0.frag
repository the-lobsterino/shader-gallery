#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	// Tu sonrisa tan resplandeciente
//A mi corazón deja encantado
//Ven toma mi mano
//Para huir de esta terrible oscuridad
//En el instante en que te volví a encontrar
//Mi mente trajo a mí aquel hermoso lugar
//Que cuando era niño fue tan valioso para mí
//Quiero saber si acaso tú conmigo quieres bailar
//Si me das tu mano te llevaré
//Por un camino cubierto de luz y oscuridad
//Tal vez sigues pensando en él
//No puedo yo saberlo, pero sé y entiendo
//Que amor necesitas tú
//Y el valor para pelear en mí lo hallarás
//Mi corazón encantado vibra
//Por el polvo de esperanza y magia
//Del universo que
//Ambicionan todos poseer
//Voy a amarte para toda la vida
//No me importa si aún no te intereso
//Ven toma mi mano
//Para huir de esta infinita oscuridad
//El universo te puedo dar
//Solo por un instante de tu mirar
//Puedo parar el tiempo
//Cuando estás cerca de mí
//Quiero borrar todas las dudas que me hacen mal
//Saber el camino para encontrar
//Ese destino que siempre imagino junto a ti
//Tantas cosas que quiero decirte
//Se quedan en silencio, no encuentro el momento
//El ruido de la ciudad
//No me permite llegar a tu corazón
//Y aunque trato de ocultar lo que siento
//Siempre ocupas tú mi pensamiento
//Ya no puedo fingir
//Lo que el corazón siente por ti
//Tú me atrapas con esa sonrisa
//Ya no vivo esta vida de prisa
//Ven dame tu mano
//Para huir de esta terrible oscuridad

}