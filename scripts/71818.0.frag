#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        
        #define TAU 6.28318530718
        
        #define TILING_FACTOR 0.5
        #define MAX_ITER 8
        
        #define R iResolution
        #define T (time/2.+2.)
        
        #define A vec3(0,1,0.005)
        #define B {vec2 m=fract(p),l=dot(p-m,A.yz)+A.xz,r=mix(fract(57.*sin(l++)),fract(57.*sin(l)),(m*=m*(3.-m-m)).x);gl_FragColor+=mix(r.x,r.y,m.y)/(s+=s);p*=mat2(1,1,1,-1);}
        
        
        float waterHighlight(vec2 p, float comp_time, float foaminess)
        {
            vec2 i = vec2(p);
            float c = 0.0;
            float foaminess_factor = mix(1.0, 6.0, foaminess);
            float inten = .005 * foaminess_factor;
        
            for (int n = 0; n < MAX_ITER; n++)
            {
                float t = comp_time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                c += 1.0/length(vec2(p.x / (sin(i.x+t)),p.y / (cos(i.y+t))));
            }
            c = 0.2 + c / (inten * float(MAX_ITER));
            c = 1.17-pow(c, 1.4);
            c = pow(abs(c), 8.0);
            return c / sqrt(foaminess_factor);
        }
        
        void main( void ) {
        
            // water
        
            float comp_time = time * 0.1+23.0;
            vec2 uv = (gl_FragCoord.xy) / resolution.xy;
            vec2 uv_square = vec2(uv.x * resolution.x / resolution.y, uv.y);
            float dist_center = pow(2.0*length(uv - 0.5), 4.0);
        
            float foaminess = smoothstep(0.4, 2.8, dist_center);
            float clearness = 0.1 + 0.9*smoothstep(0.1, 0.5, dist_center);
        
            vec2 p = mod(uv_square*TAU*TILING_FACTOR, TAU)-250.0;
        
            float c = waterHighlight(p, comp_time, foaminess);
        
            vec3 water_color = vec3(0.0, 0.35, 0.5);
            vec3 color = vec3(c);
            color = clamp(color, 0.0, 1.0);
        
           // color = mix(water_color, color, clearness);
        
            // perlin noise
            float s = 1.; //fragColor = vec4(0);		// init
            B B B B // unrolled perlin noise see https://www.shadertoy.com/view/lt3GWn
        	
		    color = mix(color, color+(sin(2.*sin(gl_FragColor*22.+T*10.)+p.yxyy-p.yyxy*0.5)/12.).rgb, clearness);
            gl_FragColor = vec4(color, 0.6);// + sin(2.*sin(gl_FragColor*22.+T*10.)+p.yxyy-p.yyxy*0.5)/12.;
        }