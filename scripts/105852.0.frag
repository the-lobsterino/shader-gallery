precision mediump float;
uniform float time; 
#define time cos( ( ( time*0.7 )/9. - 1. )*1. )*1.62*2.
uniform vec2  resolution; 
uniform vec2 mouse;
void main(void)
	{ vec2 p = (gl_FragCoord.xy * 1.0 - resolution) / (min(resolution.x, resolution.y));
	vec3 destColor=vec3(-.1*mouse.x,-.3*mouse.y,-7.);
	for( float i = 1.0 ;i<10.0;i++)
		{ float j = float(i/0.6)+1.0;
		vec2 q=vec2(cos((time*j)),sin(time*j))*.9;
		destColor+=0.003/abs(length(p/q*cos(q*mouse.x))-0.9); }
	destColor = 1. - exp2( -destColor ); // simple tonemapping
	gl_FragColor = vec4(destColor, 1.); }						////ändrom3da twist