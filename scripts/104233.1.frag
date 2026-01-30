precision mediump float;
uniform float time; 
#define time sin( ( ( time * (surfaceSize.x*surfaceSize.y) )/4. - 2. )*1. )*2.62*3.
uniform vec2  resolution; 
uniform vec2 mouse;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
void main(void)
	{ vec2 p = surfacePosition;//(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化
	vec3 destColor=vec3(-.8*sin(time),-.5*mouse.y,-0.);
	for( float i = 0.0 ;i<63.0;i++)
		{ float j = float(i*0.1)+10.0;
		vec2 q=vec2(cos(time+j),sin(time+j))*.4;
		vec2 r=vec2(cos( time-j),sin( time-j))*.4;
		vec2 s=r-vec2(cos( time+j),sin( time+j))*.4; 
		destColor+=0.004/abs(length(vec2(0.34,-.4)-p-q)-0.12);
		destColor+=0.004/abs(length(vec2(-.75,-0.38)-p-r)-0.12);
		destColor+=0.004/abs(length(vec2(-.18,0.5)-p-s)-0.12); 
	destColor *= fract( 0.8 - exp2( -destColor ) ); // whack tonemapping
		
		}
	gl_FragColor = vec4(destColor, 1.); }						////ändrom3da twist