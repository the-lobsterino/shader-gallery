precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){ p.y+=1.75*CHS;	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS))); p+=vec2(0.5,-3.25)*CHS; return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	float d = 2000.0;
	
		d = B(uv,1.0);uv.x -= 1.1;
		d = R(uv,d);uv.x -= 1.1;
		d = E(uv,d);uv.x -= 1.1;
		d = X(uv,d);uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
		d = T(uv,d);
	return smoothstep(0.0,0.23,d-0.512*CHS);
}

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    int j = 0;
    vec2 x = (mouse-.5)*2.+vec2(-3.9345, 0.2654);
    vec2 y = vec2(4.475, 0.0);
    vec2 z = p;
    for(int i = 0; i < 32; i++){
        j++;
        if(length(z) > 2.0){break;}
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x + y;
	z*= 1.+GetText((z-vec2(mod(time,12.)-6.,0.))*2.22);
    }
    
    float h = abs(mod(time * 15.0 - float(length(z)*28.), 360.0) / 360.0);;
    vec3 rgb = hsv(h, 1.0, 1.0);
    gl_FragColor = vec4(rgb, 1.0);
    
}