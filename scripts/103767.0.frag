// IZ PATTERN 4 U
#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 black  = vec3(0.0, 0.0, 0.0);
const vec3 white  = vec3(1.0, 1.0, 1.0);
const vec3 beige  = vec3(1.0, 0.8, 0.8);
const vec3 orange = vec3(1.0, 0.5, 0.0);
const vec3 brown  = vec3(0.5, 0.0, 0.0);
const vec3 red    = vec3(1.0, 0.0, 0.0);
const vec3 yellow = vec3(1.0 ,1.0, 0.0);
const vec3 green  = vec3(0.0, 1.0, 0.0);
const vec3 water  = vec3(0.0, 1.0, 1.0);
const vec3 blue   = vec3(0.0, 0.0, 1.0);
const vec3 purple = vec3(0.5, 0.0, 0.5);
const vec3 indigo = vec3(0.1, 0.1, 0.5);

void rainbow(vec2 p, vec2 offset, float size, inout vec3 i) {
    float l = length(p - offset);
    if (l < size  ) {
        if (l > (size * 9.0/10.0)  ) {
            i = red;
        } else if (l > (size * 8.0/10.0)  ) {
            i = orange;
        } else if (l > (size * 7.0/10.0)  ) {
            i = yellow;
        } else if (l > (size * 6.0/10.0)  ) {
            i = green;
        } else if (l > (size * 5.0/10.0)  ) {
            i = blue;
        } else if (l > (size * 4.0/10.0)  ) {
            i = indigo;
        } else if (l > (size * 3.0/10.0)  ) {
            i = purple;
        }
    }
}

vec3 ragga(vec2 p)
{
	p*=1.2;
	
	vec2 p2 = p*p*p;
	
	p = mix(p,p2,0.5+sin(time)*0.5);
	
    vec3 destColor = black;
    rainbow (p, vec2( 0.0, 0.0), 1.0, destColor);	
    return destColor;
}


vec2 rotz(in vec2 p, float ang) { return vec2(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang)); }
void main( void ) {

	vec2 pp = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 destColor = ragga(pp);	
	
	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0; 
	p.x *= resolution.x/resolution.y; 	
	vec3 col = vec3(-.4); 

	p.y = abs(p.y);
	
	p = rotz(p, time*0.35+atan(p.y,p.x)*6.28);
	p *= 1.1+sin(time*0.5); 
	
	for (int i = 0; i < 7; i++) {
		
		float dist = abs(p.y + sin(float(i)+time*0.1+3.0*p.x)) - 0.1;
		if (dist < 1.0) { col += (1.0-pow(abs(dist), 0.25))*vec3(0.9+0.25*sin(p.y*4.0+time),0.7+0.3*cos(p.x*4.0+time*.67),1); }
		p.xy *= 1.1; 
		p = rotz(p, 2.0);
	}
	//col *= 0.15; 
	float l = length(col);
	
	//col.rgb = col.ggg;
	
	gl_FragColor = vec4(col+destColor, 1.0); 
}