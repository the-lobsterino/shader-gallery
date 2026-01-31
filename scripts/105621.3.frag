#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//https://www.shadertoy.com/view/Dl2cWK
mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// ret.x  - distance to border
// ret.y  - distance to center
// ret.zw - cell uv
// id - cell coordinates

mat2 inverse(mat2 m) {
  return mat2(m[1][1],-m[0][1],
             -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
}
vec4 HexGrid(vec2 uv, out vec2 id)
{
    uv *= mat2(1.1547,0.0,-0.5773503,1.0);
    vec2 f = fract(uv);
    float triid = 1.0;
	if((f.x+f.y) > 1.0)
    {
        f = 1.0 - f;
     	triid = -1.0;
    }
    vec2 co = step(f.yx,f) * step(1.0-f.x-f.y,max(f.x,f.y));
    id = floor(uv) + (triid < 0.0 ? 1.0 - co : co);
    co = (f - co) * triid * mat2(0.866026,0.0,0.5,1.0);    
    uv = abs(co);
    id*=inverse(mat2(1.1547,0.0,-0.5773503,1.0)); // optional unskew IDs
    return vec4(0.5-max(uv.y,abs(dot(vec2(0.866026,0.5),uv))),length(co),co);
}

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(0);
    float t = time;
	
	vec2 uv2 = uv;
	uv *= rotate2D(t*0.35);
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
	//p.y += sin(t*0.3+p.x*.4)*0.1;
    float d = dot(p,p);
    float S = 6.;
    float a = 0.0;
	   mat2 m = rotate2D(p.x*0.1+length(p)*0.2+0.5);

    for (float j = 0.; j < 6.; j++) {
	    
        p *= m;
        n *= m;
        q = p * S + t * 0.55 + sin(t * 0.65 - d * 4.0) * 4.0 + j + a - n; // wtf???
        a += dot(cos(q)/S, vec2(0.4));
        n -= sin(q);
        S *= 1.4;
	    m=m*1.05;
    }

    col = vec3(2.5, 2.1, 0.9) * ((a*3.0)+0.2 ) + a + a - d;
   
    
    gl_FragColor = vec4(col,1.0);
}
