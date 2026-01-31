/*
 * Original shader from: https://www.shadertoy.com/view/7sV3WD
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
//Inspired by the work of @okazz
//https://twitter.com/okazz_/status/1436332410690441219

//I didn't look at their code but the result is similar enough that I wonder if the
//algorithm is the same. 

//I'm pretty sure there's also a famous painting that looks like this but I can't remember it

#define pi 3.1415926535
float h21 (vec2 a) {
    return fract(sin(dot(a.xy,vec2(12.9898,78.233)))*43758.5453123);
}
float h11 (float a) {
    return fract(sin((a)*12.9898)*43758.5453123);
}
//iq palette
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos(2.*pi*(c*t+d));
}
float box(vec2 p, vec2 b){
    vec2 d = abs(p)-b;
    return max(d.x,d.y);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 R = iResolution.xy;
    vec2 uv = (fragCoord-0.5*R.xy)/R.y;
    vec3 col = vec3(0);
    float t = mod(iTime*1.2,6000.);
    float px = 1./iResolution.y;

    //You can remove the R.x/R.y to get a square
    vec2 xRange = vec2(-0.5,0.5)*R.x/R.y;
    vec2 yRange = vec2(-0.5,0.5);
    float id = 0.;
    float seed = floor(t/6.);
    float a;


    //PLAY WITH THESE VARIABLES :D
    const float minSize = 0.01;
    const float iters = 10.;
    const float borderSize = 0.003;
    const float minIters = 1.;


    for(float i = 0.;i<iters;i++){
        float xLength = xRange.y-xRange.x;
        float yLength = yRange.y-yRange.x;
        float dividex = h21(vec2(i+id,seed))*(xLength)+xRange.x;
        float dividey = h21(vec2(i+id,seed))*(yLength)+yRange.x;

        float mn = min(length(xRange.x-dividex),length(xRange.y-dividex));
        mn = min(mn,min(length(yRange.x-dividey),length(yRange.y-dividey)));
        if(mn<minSize&&i+1.>minIters) break;
        
        //Uh idk this is probably the least efficient way to do this
        //but I can't be bothering to think about it any harder
        if(uv.x<dividex && uv.y<dividey){
            xRange = vec2(xRange.x,dividex);
            yRange = vec2(yRange.x,dividey);
            id+=dividex;
        }
        if(uv.x>=dividex && uv.y>=dividey){
            xRange = vec2(dividex,xRange.y);
            yRange = vec2(dividey,yRange.y);
            id-=dividey;
        }
        if(uv.x<dividex && uv.y>=dividey){
            xRange = vec2(xRange.x,dividex);
            yRange = vec2(dividey,yRange.y);
            id+=dividey;
        }
        if(uv.x>=dividex && uv.y<dividey){
            xRange = vec2(dividex,xRange.y);
            yRange = vec2(yRange.x,dividey);
            id-=dividex;
        }
        
        xLength = xRange.y-xRange.x;
        yLength = yRange.y-yRange.x;
        xLength*=1.0-abs(pow(cos(t*pi/58.),5.0));
        yLength*=1.0-abs(pow(cos(t*pi/6.),5.0));
        vec2 center = vec2((xRange.x+xRange.y)/2.,(yRange.x+yRange.y)/2.);
        a = box(uv-center,vec2(xLength,yLength)*0.5);
    }
    id = h11(id)*1000.0;
    vec3 e = vec3(0.5);
    vec3 al = pal(id*0.1,e*1.2,e,e*2.0,vec3(0,0.33,0.66));
    col = clamp(al,0.,1.);
    col-=smoothstep(-px,px,a+borderSize);

    fragColor = vec4(col,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}