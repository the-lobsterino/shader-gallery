// LIM(E)
#ifdef GL_ES
precision highp float;
#endif


uniform vec2      resolution;
uniform float     time;
uniform float     alpha;
uniform vec2      speed;
uniform float     shift;


float rand(vec2 n) {
  //This is just a compounded expression to simulate a random number based on a seed given as n
      return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  //Uses the rand function to generate noise
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
  //fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
      float total = 0.0, amplitude = 1.0;
      for (int i = 1; i < 4; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5;
      }
      return total;
}



 //fork
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} // KISS MY CUNT
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float N(vec2 p,float d){d=line2(d,p,vec4(-2.25,-3.25,-2.25,3.25)*CHS); d=line2(d,p,vec4(-2.25,3.25,2.0,-3.25)*CHS);return line2(d,p,vec4(2.0,-3.25,2.0,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}

float GetText(vec2 uv)
{
	float ypos = mod(time,6.);
	float t = time;
	uv*=4.;
	uv.x += 2.65;
	uv.y -= -4.+sqrt(ypos)*2.;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.,.1315 + pow(ypos/3.,20.),d-0.1*CHS);
}


#define timeMultiplier 0.4
void main() {
    //This is where our shader comes together
    const vec3 c1 = vec3(180.0/255.0, 255.0/180.0, 140.0/180.0);
    const vec3 c2 = vec3(0.0/155.0, 0.0/155.0, 120.4/120.0);
    const vec3 c3 = vec3(80.2, 0.0, 0.0);
    const vec3 c4 = vec3(0.0/0.0, 120.0/255.0, 120.4/120.0);
    const vec3 c5 = vec3(0.6);
    const vec3 c6 = vec3(0.3);

    //This is how "packed" the smoke is in our area. Try changing 8.0 to 1.0, or something else
    vec2 p = gl_FragCoord.xy * 1.0 / resolution.xx;
    //The fbm function takes p as its seed (so each pixel looks different) and time (so it shifts over time)
    float q = fbm(p - time * timeMultiplier);
    vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
	
    const vec3 c111 = vec3(0.0, 225.0/255.0, 180.0/255.0);
	
	//color
    vec3 c = mix(c111, c111, c111) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	
	//gradient
    float grad = gl_FragCoord.y / resolution.y;
	
	//sets the fragment
    vec4 mist  = vec4(c * cos(shift * gl_FragCoord.y / resolution.y), 1.0);
    mist.xyz *= 1.0-grad;
	

    	 p = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	vec3 cc = vec3(GetText(p));
	float rf = 1.;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.900 / (rf2_1 * rf2_1);	
	// xxx it. brexit 
	gl_FragColor  = mist*
		(vec4( .640-cc.rgb*e,1.0));

}
