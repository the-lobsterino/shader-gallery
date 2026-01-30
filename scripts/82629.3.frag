//#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
} 

float map(vec3 p)
{
    float d = 9.0;
    for (int i = 0; i < 32; i++) {
        float fi = float(i);
        float mtime = time * (fract(fi * 412.531 + 0.513) - 0.5) * 0.2;
        d = opSmoothUnion(
            sdSphere(p + sin(mtime + fi * vec3(52.5126, 64.62744, 632.25)) * vec3(2.0, 2.0, 0.8), mix(0.6, 1.0, fract(fi * 412.531 + 0.5124))),
            d,
            0.8
        );
    }
    return d;
}

vec3 calcNormal( in vec3 p )
{
    const float h = 1e-5; // or some other value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy*map( p + k.xyy*h ) + 
                      k.yyx*map( p + k.yyx*h ) + 
                      k.yxy*map( p + k.yxy*h ) + 
                      k.xxx*map( p + k.xxx*h ) );
}

float map2(vec3 p)
{
    float d = 9.0;
    for (int i = 0; i < 32; i++) {
        float fi = float(i);
        float mtime = time * (fract(fi * 538.531 + 0.478) - 0.5) * 0.3;
        d = opSmoothUnion(
            sdSphere(p + sin(mtime + fi * vec3(82.5126, 28.62744, 252.25)) * vec3(2.0, 2.0, 0.8), mix(0.6, 1.0, fract(fi * 538.531 + 0.5124))),
            d,
            0.8
        );
    }
    return d;
}
void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    //vec2 U = gl_FragCoord.st
    vec2 uv = fragCoord/resolution.xy;
    
    // screen size is 6m x 6m
    vec3 rayOri = vec3((uv - 0.5) * vec2(resolution.x/resolution.y, 1.0) * 3.0, 3.0);
    vec3 rayDir = vec3(0.0, 0.0, -1.0);
    
    float depth = 0.0;
    vec3 p;
    
    for(int i = 0; i < 64; i++) {
        p = rayOri + rayDir * depth;
        float dist = map(p);
        depth += dist;
        if (dist < 1e-3) {
            break;
        }
    }
    
    float depth2 = 0.0;
    vec3 q;
    for(int i = 0; i < 64; i++) {
        q = rayOri + rayDir * depth2;
        float dist2 = map2(q);
        depth2 += dist2;
        if (dist2 < 1e-3) {
            break;
        }
    }
	
    depth = min(3.0, depth);
    depth2 = min(3.0, depth2);
	
    vec3 red = vec3(0.98,0.35,0.30)*1.0;
    vec3 blue = vec3(0.4,0.62,0.98)*1.0;
    vec3 col = red; 
	
    red *= exp( -depth * 0.075 );
    blue *= exp(-depth2 * 0.075);
    float ra = 1.0 - (depth - 0.5) / 2.0;
    float ba = 1.0 - (depth2 - 0.5) / 2.0;
    //gl_FragColor = vec4(red, ra)*smoothstep(0.0,0.5,ba)+smoothstep(0.0,0.5,ra)*vec4(blue,ba);
    gl_FragColor = vec4(red, ra)*smoothstep(1.0,0.0,ba)+vec4(blue,ba)*smoothstep(1.0,0.0,ra);
    //gl_FragColor = vec4(vec3(1,0,0), 1)*smoothstep(0.0, 0.5, uv.x)+vec4(vec3(0,1,0),1)*smoothstep(0.4,0.5, uv.x);
}