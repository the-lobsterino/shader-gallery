precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time time*20. // my standard line just to check brought to you by ändrom3da just do the "time time*20." just after uniforms and everything gets sped up is that the right word i guess i am germish thank god i am.
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

//-----------------------
float snow(vec2 uv,float scale)
{

	
    float w = smoothstep(1.,0., -uv.y *(scale / 10.));
    
    if(w < .1)return -0.;
   
    uv += time / scale / 02.34;
    uv.y += time * 0./ scale;
    uv.x += sin (uv.y + time*.5) / scale;
    uv *= scale / 4.34;
    vec2 s = floor(uv), f = fract(uv), p;
    float k = 3., d;
    p = .5 + .35 * sin(11.*fract(sin((s+p+scale) * mat2(7,3,6,5))*5.)) - f;
    d = length(p);
    k = min(d,k);
    k = smoothstep(0., k, sin(f.x+f.y) * 0.02);
        return k*w;
}
//_______________________________________________



void main( void ) {

	vec2 pos = (gl_FragCoord.xy / resolution);
    	

    	pos -= .5;
    	pos.x *= resolution.x / resolution.y;

	
	float a3 = atan(pos.x) * 0.10;
	
	vec3 finalColor=vec3(0);
    float cc = 0.9;
    cc+=snow(pos,-40.);
    cc+=snow(rand(pos)*pos,72.);
    cc+=snow(rand(pos)*pos,-92.);
    cc+=snow(pos,57.);
    finalColor=(vec3(cc));
	
    	float d = length(pos);
	vec3 dd = vec3(0.20, 0.02, 0.6);
	
    	vec3 c;
    	if (d < .25) c = vec3(pos.y, pos.x, .5);
    	else c = dd*a3*vec3(pos.x*48.0, pos.x*20.0, pos.y*29.94);

 
	
    	gl_FragColor =  vec4(finalColor*c, 1.);
}
// https://www.youtube.com/watch?v=gf4uu5Rx3hc