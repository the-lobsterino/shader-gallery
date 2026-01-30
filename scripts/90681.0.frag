precision highp float;

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float random(vec2 pos){return fract(1.0*sin(pos.y+fract(100.0*sin(pos.x))));}

float noise(vec2 pos) {
	vec2 i=floor(pos),f=fract(pos);
	float a=random(i+vec2(0.0,0.0)),b=random(i+vec2(1.0,0.0)),c=random(i+vec2(0.0,1.0)),d=random(i+vec2(1.0,1.0));vec2 u=f*f*(3.0-2.0*f);
	return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}

float fbm(vec2 pos) {
	float v = 0.5;
	float a = 0.6;
	vec2 shift = vec2(100.0);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.95), cos(0.5));
	for (int i=0; i < 4; i++) {
		v += a * noise(pos);
		pos = rot * pos * 2.0 + shift;
		a *= 0.55;
	}
	return v;
}


//-----------------------
float snow(vec2 uv,float scale)
{

    return 0.0;
    float w = smoothstep(3.,0., -uv.y *(scale / 10.));
    
    if(w < .1)return -0.;
   
    uv += time / scale / 2.4;
    uv.y += time * 0./ scale;
    uv.x += sin (uv.y + time*.05) / scale;
    uv *= scale / 2.34;
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
    	

    	pos -= .4;
    	pos.x *= resolution.x / resolution.y;

	float f = fbm(pos * 8.0 * vec2(fbm(pos - (time / 8.0)), fbm(pos / 2.0 - (time / 8.0))));
	vec3 cx = vec3(3.5, 0.7, 0.4);
	cx = (f * 2.5) * cx;
	
	float a3 = atan(pos.x) * 0.10;
	
	vec3 finalColor=vec3(0);
    float cc = 0.8;
    cc+=snow(pos,-30.);
cc+=snow(pos,-13.);
    cc+=snow(rand(pos)*pos,72.);
    cc+=snow(rand(pos)*pos,92.);
    cc+=snow(pos,-78.);
    finalColor=(vec3(cc));
	
    /*
float d = length(pos);
	vec3 dd = vec3(0.80, 0.2, 0.8);
	
    	vec3 c;
    	if (d < .05) c = vec3(f, f, .5);
    	else c = dd*a3*vec3(pos.x*480.0, pos.x*80.0, pos.y*299.94);
*/
 float col = abs( .24 / (-pos.y+0.05));
	vec3 dd = vec3(0.17, 0.39, 1.09);
	
	vec3 col2 = vec3(0.1, 1, 0);
	if (pos.y < 0.05) {
	  col2 = dd;
	} else {
   	col *=5.;
	  col2 = dd* vec3(0.2, 0.15, 7.);
	}
	
	
    	gl_FragColor =  col*vec4(col2*dd*finalColor*cx*col, 1.);
}
