/*
 * Original shader from: https://www.shadertoy.com/view/st33Rr
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define NUM_OCTAVES 4

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}


float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

// -------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 V = fragCoord / iResolution.xy;
    vec2 U = (fragCoord + fragCoord - iResolution.xy) / iResolution.x;
    vec3 color = vec3(1.);
    
    float t = .8*iTime;
    
    fragColor.rgb = vec3(0.);

    if (U.x < -0.5) {
      // earth
      color = vec3(0.5,1.0,0.7);
      U.x += -0.18 * U.y;
      if(U.y<=0.0) {
        U.x += 0.24 * U.y;
      }
      U.y += 0.09 * U.x;
      if(U.x>-0.75) {
        U.y -= 0.21 * (U.x+0.75);
      }
      U.x += 0.1;
    } else if (U.x < 0.0) {
      // water
      U.y += 0.04 * cos(t- V.x * 50. + V.y * 30.) * (V.y*V.y + 0.2);
      U.y = clamp(U.y, -1.0, 0.45);
      U.x -= 0.095;
      color = vec3(0.5,0.7,1.0);
    } else if (U.x < 0.5) {
      // fire
      U += 2. * max(0.5-.5*length(U),0.)
         * vec2( fbm(vec3(U, t)), fbm(vec3(U + 5., t)) )
         * vec2(V.y*V.y);
      U.x -= .2 * V.y;
      U.y -= 0.25*mod(t, 1.25);
      U.x = (U.x - 0.25) * (V.y +.35) + 0.25;
      U.x = clamp(U.x, 0.1, 0.4);
      color = vec3(1.0,0.7,0.5);      
    } else {
      // air
      U.x += 0.2*sin(t) * cos(V.y/5.) * V.y*V.y;
      U.x = clamp(U.x, 0.6, 0.9);
      color = vec3(1.0,1.0,0.7);
    }
    
    U = sin(50.*U); 
    U = smoothstep(1.5,0.0,abs(U)/fwidth(U));
    
    fragColor += U.x + U.y;
    fragColor.rgb *= color;
    /*
    if(V.x < 0.5) {
     fragColor.rgb = vec3(V.y +.35);
    } else {
     fragColor.rgb = vec3(cos(2. + V.y*3.1415)/2. + 1.);
    }
    */
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}