#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void _2(){vec2 p = 1.*( gl_FragCoord.xy / resolution.xy) + vec2(13.13 *time,.0);
p.y+=1.1;p.x*=3.+p.y-(p.y*=-.75+p.y*.75);p.x*=.1;float color = 1.0;color += abs(ceil(sin(p.x*2.0 ) + cos(p.y * 24.0 )));
gl_FragColor += vec4( vec3(p.y*-color*-0.25, p.y*0.25, color*p.y*0.2), 1.0 );
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
    vec3 col = vec3(0);
    float t = time*0.9;
    
	uv *= .5;
	uv.x /= dot(uv,uv)*20.0;
	//uv /= 0.15/uv;
	float d = 0.2-length(uv);
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv*5.65;
    float S = 5.;
    float a = 0.0;
	
	    //float vv = 0.5+sin(time*0.1)*0.5;
	    
	    float vv = fract(time*0.005);
	    //vv = smoothstep(0.0,1.0,vv);
	    vv = mix(0.0,25.0,vv);
            mat2 m = rotate2D(vv);
	

    for (float j = 0.; j < 6.; j++) {
	    
	    p*=rotate2D(j*.125);
	    m*=1.03;

        //p *= m*1.05;
        n *= m*0.95;
        q = p * S + t * 2.5 + sin((t + j)) * .0018 + 3.*j - 1.25*n; // wtf???
        a += dot(cos(q)/S, vec2(.225));
        n -= sin(q);
        S *= 1.445;
    }

    col = vec3(1.925, 3.24, 1.15) * (a + .182) + 9.*a + a + d;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);//_2();
}