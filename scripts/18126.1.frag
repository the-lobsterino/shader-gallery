#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float InterpLinear(float n) { return n; }
float InterpPow(float n, float e) { return pow(n,e); }
float InterpHermite(float n) { return n*n*(3.0-2.0*n); }

void main( void ) 
{
   vec2 uv = ( gl_FragCoord.xy / resolution.xy );
   float r = InterpHermite(uv.x*tan(time*0.3+uv.y*2.+uv.x));
   gl_FragColor = vec4( vec3( r > uv.y ? 1 : 0 ), 1.0 );
	
}