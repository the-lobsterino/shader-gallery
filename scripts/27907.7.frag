#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//f(x) grapher using discrete lines and domain repetition

float tau = atan(1.0)*8.0;

vec2 scale = vec2(2, 4);

float rep = 1.0 / (resolution.x / 2.0);

float distline(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1-p0);
	uv = (uv-p0) * mat2(dir.x,dir.y,-dir.y,dir.x);
	return distance(uv,clamp(uv,vec2(0),vec2(distance(p0,p1),0)));   
}

float f(float x)
{
	float sqr = step(0.5, fract(x - time * 0.1));
	float sine = sin(2.0 * tau * x);
	float saw = fract(8.0 * x + time) - 0.5;
	return sqr + sine + saw;
}

vec4 sample(vec4 sx)
{
	sx *= scale.x * 0.5;
	return vec4(f(sx.x), f(sx.y), f(sx.z), f(sx.w)) / scale.y * 0.5;
}

void main(void) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	uv.y -= aspect.y/2.0;

	float dist = 1e6;
	
	vec2 ruv = vec2(mod(uv.x, rep), uv.y);
	
	vec4 offs = vec4(-1, 0, 1, 2);
	vec4 sx = (offs * rep);
	vec4 sy = sample((offs + floor(uv.x / rep)) * rep);
	
	vec2 p0 = vec2(sx.x, sy.x);
	vec2 p1 = vec2(sx.y, sy.y);
	vec2 p2 = vec2(sx.z, sy.z);
	vec2 p3 = vec2(sx.w, sy.w);
	
	dist = min(dist, distline(p0, p1, ruv));
	dist = min(dist, distline(p1, p2, ruv));
	dist = min(dist, distline(p2, p3, ruv));
	
	float lw = 2.0 / resolution.y;
	
	float color = smoothstep(lw, 0.0, dist);
		
	gl_FragColor = vec4( vec3( color ), 1.0 );

}