/*
 * Original shader from: https://www.shadertoy.com/view/3ljyDW
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
float box(vec2 uv, float r, float t){
    float m = (step(r,abs(uv.x)))*.5-step(abs(uv.y),.5-r-t);
    m = max(m,(step(r,abs(uv.y)))*.5);
    m += (step(r+t,abs(uv.x)))-step(abs(uv.y),.5-r-t/4.);
    m = max(m,(step(r+t,abs(uv.y))));
    float p = (step(r,abs(uv.x))-step(r+t,abs(uv.x))-step(abs(uv.y),r+t))/2.;
    if (p>0.) m -= .5;
    return m;
}
float cros(vec2 uv, float r, float t){
    float m = step(abs(uv.x),r+t)*0.5;
    m = max(m,step(abs(uv.y),r+t)*0.5);
    m += step(abs(uv.x),r);
    m = max(m,step(abs(uv.y),r)-step(abs(uv.x),r+t));
    
    
    
    return m;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    uv.y += cos(uv.y*3.+uv.x*4.+iTime*2.)*.05;
    float a = 3.142/4.;  
    uv = uv*mat2(cos(a),-sin(a),sin(a),cos(a));
    
    uv = fract(uv * 5.)-.5;
    vec3 col = vec3(0.);
	
    float m = cros(uv,.15,.04);
    col += m;
    m = box(uv,.3,.04);
    
    if (m>0.) col = vec3(m);
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}