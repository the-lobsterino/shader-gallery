/*
 * Original shader from: https://www.shadertoy.com/view/7dBSWG
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
#define PI 3.141592653589793
#define R 2.
#define MARGIN 2.
#define GRIDS 4.


float Circle(vec2 st, vec2 o, float r, float blur) {
	 return smoothstep(r+blur, r, distance(st, o));
}

mat2 Rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
            sin(angle),cos(angle));
}

float Shape(vec2 st, float angle, float blur) {
    // 对单个格子缩放画布
    // scale canvas for single grid
    float width = PI+R+MARGIN;
    st *= width;
    
    // 对角镜像
    // diagonal mirror
    st = st.x + st.y > width ? width - st : st;

    st = Rotate2d(angle) * st;
    st = abs(st);    
    
    // 绘制"头部"。Y从R向0移动时，圆心逐渐向远处移动，使圆变形
    // draw "head", shift circle origin as Y decrease to 0, deform it heart-like
    float deform = 0.6;
    float circle = Circle(st, vec2(PI+(st.y-R) * deform, 0.), R, blur);
    
    // 绘制"颈部"，对cos函数做缩放偏移, "shift"控制粗细
    // draw "neck" with cosine wave, "shift" controls thickness
    float shift = 0.35;
    float cosine = -cos(st.x) * (1.0-shift) + 1.+shift;
    float cosineDist = smoothstep(blur, 0., st.y - cosine);
    
    float mask = st.x < PI ? cosineDist : circle;
    return mask;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    uv *= GRIDS;

    vec2 st = fract(uv);
    vec2 id = floor(uv);
    
    float t = iTime;
    float angle = 0.;
    angle = sin(t*0.6) * PI;
    float everyOther = mod(id.x + id.y, 2.);
    
    // 每隔一个格子初始角度偏移PI/2，为了画面衔接
    // every other grid shift init angle by PI/2
    angle += everyOther * PI * 0.5;
    
    // 每隔一个格子初始角度偏移PI/2，为了画面衔接
    // every other grid rotate reversly
    angle *= everyOther * 2. - 1.0;
    
    float blur = 0.01 * GRIDS;
    float mask = 0.;
    mask += Shape(st, angle, blur);
    
    // 叠加第二层，目前没学会如何用对称的方法处理第二层。如果有请教教我
    // overlap layer 2. how to handle layer 2 by kind of "symmetry"?
	mask += Shape(vec2(1.0-st.y, st.x), -angle, blur);
    vec3 color = vec3(mask);

    // Output to screen
    fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}