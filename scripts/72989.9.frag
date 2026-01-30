// DOGSHITE, I FUCKED YOUR MUM
// also fucked your sister
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution


// logo go spinny
vec3 logo(vec2 u, float time)
{
    mat2 x = mat2(cos(time),sin(time),-sin(time),cos(time));
    mat2 y = mat2(sin(time),cos(time),-cos(time),sin(time));
    float l = length(u);
    
    if (l < .17) {
        return vec3(1.);
    } else if (l < .22) {
        u = x*u;
        if (abs(u.y) < 0.02) {
            return vec3(1.);

        } else {
            return vec3(.82,.0,.1);
        }
    } else if (l < .25) {
        return vec3(1.);
    } else if (l < .4) {
        u = y*u;
        if (l > .32) {
            float a = fract((atan(u.y,u.x)/(atan(-1.)*4.)+0.5)*3.);
            if ((l > 0.37) && (a > .84-(l*2.) && a < .15+(l*2.))) {
                return vec3(1.);
            } else if (a > 0.27-l/2. && a < 0.72+l/2.) {
                return vec3(1.);
            }
        }
        if (abs(u.y) < 0.02) {
            return vec3(1.);
        } else if (u.y < 0.) {
            return vec3(0.35,0.32,0.32);
        } else {
            return vec3(0.12);
        }
    } else if (l < .44) {
        return vec3(1.);
    } else if (l < .5) {
        return vec3(0.12);
    } 
    
    return vec3(0.0,0.4,0.0);
}

float Hash21(vec2 p) {
    float t = iTime/220.;
    p = fract(p*vec2(234.35, 935.775));
    p += dot(p, p+24.23+t);
    return fract(p.x * p.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy - iResolution.xy*.5)/iResolution.y;
	
	float dd = length(uv);
	
    
    uv *= 144.;
    
    vec2 gv = fract(uv)-.5;
    vec2 id = floor(uv*0.2);

    float n = Hash21(id +7.364)*1.0-length(gv*2.0+dd); 
    
//    vec3 col = vec3(0.47,1.0,0.77)*n;
	
	vec3 col = logo(uv*0.01,time);
	col += vec3(0.47,1.0,0.77)*n;
	
    fragColor = vec4(col, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}