precision highp float;

// Shaders are coming back in style
// IG @pecsimax 
// TW @koo1ant

#define t time
#define resolution resolution

uniform vec2 resolution;
uniform float time;
uniform float u_time;


mat4 rotX(in float angle) {
    return mat4(
        1, 0, 0, 0,
        0, cos(angle), - sin(angle), 0,
        0, sin(angle), cos(angle), 0,
    0, 0, 0, 1);
}

mat4 rotY(in float angle) {
    return mat4(
        cos(angle), 0, sin(angle), 0,
        0, 1.0, 0, 0,
        - sin(angle), 0, cos(angle), 0,
    0, 0, 0, 1);
}

vec2 setupSpace(in vec2 f, in vec2 res)
{
    return
    (f.xy / res.xy - 0.5) *
    vec2(res.x / res.y, 1.0) * 2.0;
}

float sat(float v){
    return clamp(v, 0.,1.);
}

void ball(inout float buf, vec2 uv, float phase, float radius, float bh) {
    float bounce = abs(sin(t * 3.0 + phase)) * bh;
    float bd = 1.00 + pow(abs(sin(t * 3.0 + 3.14 / 2.0 - 0.1 + phase)), 50.00) * 0.17;
    float ballRadius = radius;
    float shadowSize = abs(sin(t * 3.0 + phase)) * 1.00 + 1.00;
    float a = atan(uv.y - bounce + 0.02, uv.x + -0.37);

    // Shadow
    float shadow = 1.0 - smoothstep(-0.5, 0.8, length(vec2(uv.x * (shadowSize*2.), uv.y * 1.75 * (shadowSize*2.)) - vec2(0.00, - 0.36)) - ballRadius + 0.0);
    buf -= smoothstep(0.0, 0.8, shadow) * 0.8; // Soften the shadow a little bit
	
    // Cut a hole in the buffer
    buf *= step(0.00, length(vec2(uv.x/bd, uv.y * bd) - vec2(0.01, bounce)) - ballRadius);

    // Add specular
    float mask = sat(1.0 - step(0.00, length(vec2(uv.x/bd, uv.y * bd) - vec2(0.01, bounce)) - ballRadius));
    float impulse = sin(t*6.+1.20); // Spin a little faster when it hits the ground
    float spin = sin(a * 18.0 - ((t * 12.0) - impulse)) * 0.03;
    float specular = smoothstep(
        0.30 - spin,
        -0.02,
        length(vec2(uv.x / bd, uv.y * bd) - vec2(0.02, bounce + 0.14)) - ballRadius + 0.23) *  mask +
        // Fake reflection
        smoothstep(
            0.30 + sin(a * 18.0 + t*10.) * 0.02,
            +0.62,
        length(vec2(uv.x / bd, uv.y * bd) - vec2(0.02, bounce + 0.14)) - ballRadius + 0.23) * mask;;

    buf += specular;
}

void ground(inout float p, vec2 uv, float offset) {
    vec2 guv = uv;
    guv.x = abs(fract(guv.x*1.50)*2.-1.);

    guv.y = fract(guv.y*2.70)*1.50 + offset + -1.00;
    // Sine checkers
    //p += step(sin(uv.y * 10.00) * sin(t), sin(uv.x * 10.0));
    p -=  1.-step(0.00,guv.x+guv.y) -1.0 +step(0.77, guv.x + guv.y);
}

void light(inout float p, vec2 pv){
    vec2 lightPos = vec2(pv.x, pv.y - 2.);
    p *= 1.-smoothstep(0.0, 3.5, length(lightPos - vec2(sin(t), 0.0)));
}

void projection(inout vec2 pv){
	 vec4 m =
        vec4(pv.x, pv.y, 0.00, 0.00) *
        rotY(sin(t * 1.0) * 0.1) *
        rotX(0.60) *
        1.2 + 0.2;
    
    pv /= abs(0.8 - m.z);
}

vec4 image()
{
    vec2 pv = setupSpace(gl_FragCoord.xy, resolution.xy); // Perspective UV
    vec2 uv = setupSpace(gl_FragCoord.xy, resolution.xy); // Screen-space UV
    float camPos = -t*0.8; // Camera speed
    float p; // Image
    
   	projection(pv);
    
    pv.y += camPos;
   
    // Scene
    float w = 1.50;
    ground(p, pv, 0.00);
    ground(p, pv, -w);
    ground(p, pv, +w);
    light(p, vec2(pv.x, pv.y - camPos));
    ball(p, vec2(uv.x + -0.1 + sin(t*0.9+0.4)*0.1 , uv.y + -0.40), 1.00 , 0.18, 0.2);
    
    vec3 color = vec3(p);
    color.r += -abs(uv.y)*0.2;
    color.b += 0.05;
    
    return vec4(color, 1.0);
}
void main()
{
    gl_FragColor = image();
}

