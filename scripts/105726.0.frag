precision mediump float;
uniform float time; 
#define time cos( ( ( time*0.1 )/9. - 8. )*1. )*8.62*3.
uniform vec2  resolution; 
uniform vec2 mouse;
void main(void)
	{ vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / (min(resolution.x, resolution.y));
	vec3 destColor=vec3(-.8*mouse.x,-.5*mouse.y,-0.);
	for( float i = 0.0 ;i<40.0;i++)
		{ float j = float(i/0.1)+1.0;
		vec2 q=vec2(cos((time*j)),sin(time*j))*.8;
		destColor+=0.003/abs(length(p/q*cos(q*mouse.x))-0.8); }
	destColor = 1. - exp2( -destColor ); // simple tonemapping
	gl_FragColor = vec4(destColor, 1.); }						////ändrom3da twist