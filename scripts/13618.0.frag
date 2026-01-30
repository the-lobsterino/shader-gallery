#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/** 
@mattdesl - testing pixel-style cross hatching... 

view it on resolution 2. 

Vlad: Removed the un-used fbm noise functions. 

...Just curious as to what it looked like without the cross-hatching.

*/

float rand(vec2 co){
    return fract(cos(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float hash( float n ) //Borrowed from voltage
{
    return fract(sin(n)*355758.5453);
}

float noise( in vec2 x )//Borroowed from Mark Sleith
{
vec2 p = floor(x);
vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    return res;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	position.x *= resolution.x/resolution.y;

	float radius = 0.45;
	float z = sqrt(radius*radius - position.x*position.x - position.y*position.y);

	vec3 N = normalize( vec3(position.xy, z) );
	
	//hmm... this is not a good way of jittering the normals
	N.xyz += noise(position.xy*200.0)  *0.15;
	
	vec3 L = normalize(vec3(mouse.xy-0.5, (sin(time*0.075)/2.0+1.0)*1.35));
		
	float diffuse = max(0.0, dot(N, L));

	//presumably this would be better sampled from a repeating texture..
	float hatchTex = 0.0;

	float step1 = 0.25;
	float rounded = floor(diffuse/step1 + 0.5)*step1;
	diffuse *= rounded;
		
	if(mod(floor(gl_FragCoord.y ), 2.0) == 0.0 && mod(floor(gl_FragCoord.x + 0.5), 2.0) != 0.0)		
		hatchTex = 1.0;
	
	if(mod(floor(gl_FragCoord.x * gl_FragCoord.y), 2.0) == 0.0 && mod(floor(gl_FragCoord.y*gl_FragCoord.x - 0.5), 2.0) != 0.0)		
		hatchTex = 1.0 - (1.0-rounded);
	
	
	vec3 c0 = vec3(0.98, 0.98, 0.99);
	vec3 c1 = vec3(0.9, 0.8, 1.0);
	vec3 c2 = vec3(0.7, 0.6, 0.8);
	vec3 c3 = vec3(0.6, 0.45, 0.7);
	vec3 c4 = vec3(0.4, 0.3, 0.5);
	vec3 c5 = vec3(0.3, 0.2, 0.4);
	vec3 bg = vec3(0.0, 0.0, 0.3);
	vec3 c = vec3(0.3, 0.4, 0.5);
	
	//a 1D texture lookup might help here....
	if (diffuse > 0.95) c = c0;
	else if (diffuse > 0.7) c = c1;
	else if (diffuse > 0.6) c = c2;
	else if (diffuse > 0.35) c = c3;
	else if (diffuse > 0.1) c = c4;
	else if (diffuse > 0.01) c = c5;
	else if (z < radius) c = bg;
	
		
	gl_FragColor = vec4( vec3( c ), 1.0 );

}