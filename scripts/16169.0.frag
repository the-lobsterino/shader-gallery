#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float line(vec2 p, vec2 a, vec2 b, float w){
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return smoothstep(w, 0., l.x+l.y);
}

float plotFunc(float x)
{
	return (floor(fract(x*8.0+time) + 0.5)*2.0-1.0) * 0.5;	
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float pixelSize = 1.0 / max(resolution.x, resolution.y);
	vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
	vec2 mt = ( mouse * 2.0 - 1.0 ) * aspect;
	vec2 p = ( uv * 2.0 - 1.0 ) * aspect;
	float c = 0.0;
	float samples = 512.0;
	float ls, rs;
	ls = floor(uv.x*samples)/samples;
	rs = ceil(uv.x*samples)/samples;
	float lsv, rsv;
	lsv = plotFunc(ls);
	rsv = plotFunc(rs);
	ls = (ls * 2.0 - 1.0) * aspect.x;
	rs = (rs * 2.0 - 1.0) * aspect.x;
	c = line(p, vec2(ls, lsv), vec2(rs, rsv), pixelSize*8.0);
	gl_FragColor = vec4( vec3( 0.0, c, c*0.5 ), 1.0 );

}