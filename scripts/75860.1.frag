/*
 * Original shader from: https://www.shadertoy.com/view/ss3XWX
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define pi 3.14159

// Code modified from here:
// https://thebookofshaders.com/edit.php#09/marching_dots.frag
// https://www.osar.fr/notes/logspherical/

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 movingTiles(vec2 _st, float _zoom, float _speed){
    //_st.x = fract(2.*_st.x);
    //_st.y = fract(2. * _st.y);
    float time = iTime*_speed;
    float ft = fract(2.*abs(_st.x-0.5) + 2.*abs(_st.y -0.5)  + time);
    
    _st *= _zoom;//sqrt(_zoom);
    
    float k = step(0.5, ft);
    _st.x += k * sign(fract(_st.y * 0.5) - 0.5) *ft * 2.0;
    _st.y += (1.-k) * sign(fract(_st.x * 0.5) - 0.5) * ft * 2.0;
	
    // replace 3. for fun times
    return fract(_st * 3.);
}

float circle(vec2 uv, float r){
    uv = uv - .5;
 //  float a = atan(uv.y, uv.x);  
 //  return step(length(uv) * (1. + cos(20. * a + iTime)) * 0.4, r);
   
   return smoothstep(1.0-r,1.0-r+r*0.2,1.-dot(uv,uv)*3.14);
}

void render( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 st = (fragCoord - .5 * iResolution.xy) /iResolution.y;
    float time = iTime;
    
    // Apply the forward log-polar map
    st = vec2(log(length(st)), atan(st.y, st.x));

    // Scale everything so tiles will fit nicely in the ]-pi,pi] interval
    st *= 0.5/pi;

    // Convert pos to single-tile coordinates
    st.x = fract(st.x - 0.05 * time) - 0.;
    st.y = fract(st.y + 0.03 * time) - 0.;

    // Do the actual pattern
    float zoom = 17.;
    
    // Cut uv into smaller uvs
    vec2 uv = fract(st * zoom);
    vec2 ft = floor(st * zoom);
    
    // Generate values for each corner of uv
    float l = h21(vec2(mod(ft.x+1., zoom), ft.y));
    float t = h21(vec2(ft.x, mod(ft.y+1., zoom)));
    float tl = h21(vec2(mod(ft.x+1.,zoom), mod(ft.y+1., zoom)));
    float id = h21(vec2(ft.x, ft.y));

    // Smooth edges of uvs so they meet nicely
    uv = uv * uv * (3. - 2. * uv);
    
    // Box lerp between corner values
    float v = l * uv.x * (1.-uv.y)
     	    + t * (1.-uv.x) * uv.y
     	    + tl * uv.x * uv.y
      	    + id * (1.-uv.x) * (1.-uv.y);
        
    // Generate tile pattern
    st = movingTiles(st, zoom, 0.2);

    // Scale circles weirdly ( set to 1. to see normal )
    float sc = (1. + 0.5 * cos(time + 10.*cos(10. * v)));
    vec3 color = vec3( circle(st, 0. + 0.8 * v * sc) - circle(st, 0.6 * v * sc) );

    fragColor =  vec4(color, 1.);
}


//Copy paste this under the other shader
#define AA 2.
#define ZERO 0.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float px = 1.0/AA;
    vec4 col = vec4(0);
    
    if(AA==1.0) {render(col,fragCoord); fragColor = col; return;}
    
    for(float i = ZERO; i <AA; i++){
        for(float j = ZERO; j <AA; j++){
            vec4 col2;
            vec2 coord = vec2(fragCoord.x+px*i,fragCoord.y+px*j);
            render(col2,coord);
            col.rgb+=col2.rgb;
            //If the shader has global variables they need to be reset here
        }
    }
    col/=AA*AA;
    fragColor = vec4(col);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}