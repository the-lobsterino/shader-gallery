/*
 * Original shader from: https://www.shadertoy.com/view/3lVSWt
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
#define bpm 124.
#define beat floor(iTime*bpm/60.)
#define ttime iTime*bpm/60.
mat2 r(float a){
float c=cos(a),s=sin(a);
return mat2(c,-s,s,c);
}
float fig(vec2 uv){
    uv*=r(-3.1415*.9);
return min(1.,.1/abs( (atan(uv.x,uv.y)/2.*3.1415)-sin(- ttime+(min(.6,length(uv)))*3.141592*8.)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy-.9* iResolution.xy)/iResolution.y;
    uv+=vec2(cos(iTime/.001),sin(iTime/.001));
    uv*=r(iTime*.01);
    vec3 col = vec3(-.0);
    for(float y=-1.;y<=1.;y++){
    for(float x=-1.;x<=1.;x++){
    vec2 offset = vec2(x,y);
    vec2 id = floor((uv+offset)*r(length(uv+offset)));
    vec2 gv = fract((uv+offset)*r(length(uv+offset)))-.5;
        gv*=r(cos(length(id)*02.));
    float d = fig(gv);+fig(gv+vec2(sin(ttime+length(id))*.1,cos(iTime)*.0001));
    col += vec3(d)/exp(length(gv)*1.);

    
    }}
    col = mix(vec3(.1,.01,.02),vec3(.8,.24,.9),col);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}