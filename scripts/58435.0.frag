#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 R = resolution;
mat2 r;

float sdBox( vec2 p, vec2 b )
{
   vec2 q = abs(p) - b;
   return length(max(q,0.0)) + min(max(q.x,q.y),0.0);
}

float walls(vec2 p)
{
   return min(p.x,min(p.y,min(R.x-p.x,R.y-p.y)));
}

float content(vec2 p)
{
   return min(length(p-vec2(0.83,0.24)*R)-R.x/20.0, min(sdBox((p-vec2(0.3,0.7)*R)*r,vec2(0.05,0.1)*R.x), min(length(p)-R.x/10.0,length(p-R)-R.x/5.0)));
}

float distToScene(vec2 p)
{
   return min(content(p),walls(p));
}

void main( void ) 
{
   vec2 uv = gl_FragCoord.xy;
   float s = sin(time), c = cos(time);
   r = mat2(c, -s, s, c); 
   float scene = -distToScene(uv);
	
   gl_FragColor=vec4(0.1,0.1,0.2,1.0);
   gl_FragColor=mix(vec4(0.0,0.0,1.0,1.0),gl_FragColor,smoothstep(scene, -1., 4.));
   gl_FragColor=mix(vec4(1.0,1.0,1.0,1.0),gl_FragColor,smoothstep(scene, -1., 1.));
}