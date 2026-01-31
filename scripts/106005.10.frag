// chatgpt, make it better, ta
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 turbo(in float x) {
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);
  
  x = clamp(x, 0.0, 1.0);
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}
mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// based on the follow tweet:
// https://twitter.com/zozuar/status/1621229990267310081
void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	float d2 = length(uv);
	float d3 = smoothstep(0.0,0.135,d2)*3.0;
	uv*=rotate2D(d3+time*0.1);
	uv.xy/=dot(uv,uv)*14.0;
    vec3 col = vec3(0);
    float t = time;
    //vec2 umouse = (mouse / resolution) -3.5;
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
	//p.y += sin(t*0.3+p.x*.4)*1.1;
    float d = dot(p,p);
    float S = 4.05;
    float a = 0.125;
	   mat2 m = rotate2D(length(p)*.25+0.5);

    for (float j = 0.; j < 8.; j++) {
	    
        p *= m*1.05;
        n *= m*0.985;
        q = (p * S + t * 0.6 + sin(t * 0.25 - d * 4.0) * 4.0 + j + a - n);// wtf???
        a += dot(cos(q)/S, vec2(0.475));
        n -= sin(q);
        S *= 1.425 ;
	    m=m*1.085;
    }

    a=abs(a)+0.135;
    a = pow(a,2.8);
    col = turbo(a/0.2);
    
	d2 = smoothstep(0.0,0.25,d2);
    // Output to screen
    gl_FragColor = vec4(col*(d2),1.0);
}
