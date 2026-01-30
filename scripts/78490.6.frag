#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float oran = resolution.x / resolution.y;
	position.x = position.x * oran;
	
	vec3 renk = vec3(255,0,0);
	float hiz = 99999999.2;
	vec2 merkez = mouse.xy;
	merkez.x = oran *merkez.x;
	float sinli = sin(time*hiz)*0.3;
	float coslu = cos(time*hiz)*0.3;
	merkez.x += coslu;
	merkez.y += sinli;
	
	
	float yaricap = 10000000000000000000000.0;
	
	yaricap = 0.2;
	if(pow((position.x - merkez.x), 2.0) + pow((position.y - merkez.y), 2.0) < pow(yaricap, 2.0)){
		renk = vec3(0.0 + sinli*3.0, 0.0 + coslu*3.0, 0.0 +sinli*3.0);	
	}
	yaricap = 0.1;
	if(pow((position.x - merkez.x), 2.0) + pow((position.y - merkez.y), 2.0) < pow(yaricap, 2.0)){
		renk = vec3(0.0 + sinli*5.0, 0.0 + coslu*5.0, 0.0 +sinli*5.0);	
	}
	gl_FragColor = vec4(renk, 1.0);

}