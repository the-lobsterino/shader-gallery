#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	
	float x = (cos(sin(uv.y*10.0)*10.0+uv.x*6.28*10.0+time*10.0)-1.0)*-.5;
	float y = (cos(uv.y*100.0+uv.x*6.28*40.0+time*-10.0)-1.0)*-.5;
	x*=y;
	
	float X = (cos(uv.x*6.28*23.0+time*-10.0)-1.0)*-.5;
	float Y = (cos(uv.x*6.28*86.0+time*10.0)-1.0)*-.5;
	X*=Y;
	
	//x+=X;
	
	gl_FragColor = vec4(x,x,x,1.0);// vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}