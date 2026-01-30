#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

vec3 outCol = vec3 (.0); 

vec3 turbo(float x) {
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973); 
  x = fract(x);
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}
#ifdef GL_ES
precision mediump float;
#endif

float CNDrecruse(float x){
  if(x < 0.) {
    return x;
  } else {
    float k = 1.0 / (1.0 + 0.2316419 * x);
    return ( 1. - exp(-x * x / 2.)/ sqrt(2.*3.141592) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
  }
}


float CND(float x){
  if(x < 0.) {
    return ( 1.-CNDrecruse(-x) );
  } else {
    float k = 1.0 / (1.0 + 0.2316419 * x);
    return ( 1. - exp(-x * x / 2.)/ sqrt(2.*3.141592) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
  }
}


float BlackScholes(float PutCallFlag, float S, float X, float T, float r, float v) {
  float d1 = (log(S / X) + (r + v * v / 2.0) * T) / (v * sqrt(T));
  float d2 = d1 - v * sqrt(T);
  if (PutCallFlag == 1.0) {
    return ( S * CND(d1)-X * exp(-r * T) * CND(d2) );
  } else {
    return ( X * exp(-r * T) * CND(-d2) - S * CND(-d1) );
  }
}



void yonatansFractal (float t, float time, vec2 FC, vec2 r, vec3 color, inout vec3 o)
{
    float g=0., e, s, k = t*.05;
    for(float i=0.; i < 64.;++i) {
        vec3 p = vec3(g*(FC.xy - .25*r)/r.y + .2,g - 1.);
	p.xz *= mat2(cos(k),sin(k),-sin(k),cos(k));
	p.xy += (vec2(cos(t*.1),sin(t*.1)) + 1.) * vec2(2.5, .25);
        s = 3.;
        for(int i=0; i < 8; ++i ) {
            s *= e = max(1.,(11.-2.*cos(k*(mouse.y * 0.2)))/dot(p,p*5.));
            p = vec3(2,4,.1) - abs(abs(p)*e - vec3(4,4,2) );
        }
        g += ((max(length(p.xz), p.y)/s) * (min(length(p.xz), p.y)/s)) * 2. ;
	g += max(length(p.xz), p.y)/s * 0.51;
        g -= min(length(p.xz), p.y)/s * 0.5*sin(time);


	    //o.rg += (s + .9, 11.3, s/5e4);
	o.rgb += turbo(log(pow(s, color.y)) + k*.45) * .0165;
    }
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy * 6. - resolution) / resolution.y; //* mix(0.067, 3.0, tw());
	vec3 color;
	float t = uv.x * 72. + time * 50. * 10.;
	for (int i = 0; i < 3; i++) {
		color[i] = (BlackScholes(0.0, mouse.y + float(i) / 4. , uv.x, mouse.x * float(1 + i), uv.y, 1.0));
	}
	yonatansFractal(993. + mouse.x * 2., time, gl_FragCoord.xy, resolution.xy + color.xy, color, outCol);
    vec4 asdf = gl_FragColor = vec4(outCol + color/resolution.xyy*0.12, 1.) * vec4(0.65,1.,1.,1.);
		float phase = 0.5 * 3.1415;

	gl_FragColor = asdf;// + vec4(color + (BlackScholes(1.0, mouse.y , uv.x, mouse.x, uv.y, 1.0)), 1.0);
}