#ifdef GL_ES
precision mediump float;
#endif
//hitler did nothing wrong 
//Swastika flag.
//Deleted shader by "anastadunbar" from Shadertoy.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SHARP 800.
#define PI 3.14159265358979323

//http://stackoverflow.com/questions/30545052/calculate-signed-distance-between-point-and-rectangle
float sdAxisAlignedRect(vec2 uv, vec2 tl, vec2 br) 
{
    vec2 d = max(tl-uv, uv-br);
    return length(max(vec2(0.042), d)) + min(0.0, max(d.x, d.y));
}

vec2 rotation(in float angle,in vec2 position/*,in vec2 center*/)
{
    //Function seen from https://www.shadertoy.com/view/XlsGWf
    float rot = radians(angle);
    mat2 rotation = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    return vec2((position/*-center*/)*rotation);
}

float leg(vec2 uv,float b) {
    return min(sdAxisAlignedRect(uv-vec2(-(b-1.),0.),vec2(1.,1.),vec2(b,1.)),sdAxisAlignedRect(uv-vec2(-(b-1.),0.),vec2(1.,1.),vec2(1.,b)));
}

float chess_dist(vec2 uv) {
    return max(abs(uv.x),abs(uv.y));
}

vec4 swastika_flag(vec2 uv) {
    vec3 drawing = vec3(0.);
    
    drawing = mix(vec3(1.),vec3(0.9,0.,0.),clamp(((length(uv-0.5)-0.45)*SHARP),0.,1.));
    
    float atans = (atan(uv.x-0.5,uv.y-0.5)+PI)/(PI*2.);
    
    float swastika = clamp(1.-((leg(rotation((floor((atans-(float(length(uv-0.5)>0.26)*0.04))*4.)-0.5)*90.,uv-0.5)+1.,1.23)-0.06)*SHARP),0.,1.);
    
    drawing = mix(drawing,vec3(0.),swastika);
    
    //return vec4(drawing,step(uv.x,1.4)*step(-0.4,uv.x)*step(uv.y,1.)*step(-0.,uv.y));
    return vec4(drawing,1.-clamp(((chess_dist((uv-0.5)*vec2(1.2,2.))-1.)*(SHARP*0.5)),0.,1.));
}

void main( void ) {
    vec2 pos = gl_FragCoord.xy / resolution.xy;
    vec2 uv = vec2(((pos.x-0.5)*(resolution.x / resolution.y))+0.5,pos.y);
    vec3 background = vec3(0.,0.,0.);
  
    float wave = (sin(time+(uv.x*17.))*.04)+(sin((time*4.)+(uv.y*20.))*0.005);
    vec2 uv2 = ((uv-0.5)*(wave+1.4))+0.5;
	gl_FragColor = vec4(mix(background,clamp(swastika_flag(uv2).rgb-(wave*2.),0.,1.),swastika_flag(uv2).a),1.);
}