#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define atime time*0.01011102386
#define btime mix(sin(mix(time*0.6666,time*cos(13.5+sin(time)*0.666/cos(tan(-time*7.77))), sin(time))), time, sin(time*0.777))
#define ctime mix(sin(1.618336699*mix(time*0.6666, atime*cos(13.5+sin(btime)*0.666/cos(tan(-atime*7.77))), sin(-time*0.01236+fract(btime*63897634.)/9.))-232323.*sqrt(btime*0.657)), atime*cos(13.5+sin(time)*0.666/cos(tan(-time*7.77))), sin(-time*0.01236+fract(btime*63897634.)/9.))
#define time mix(sin(1.618336699*mix(time*0.6666, time*cos(13.5+sin(time)*0.666/cos(tan(-time*7.77))), sin(-time*0.01236+fract(time*63897634.)/9.))-232323.*sqrt(time*0.657)), time*cos(13.5+sin(time)*0.666/cos(sin(-time*7.77))), sin(-time*0.01236+fract(time*63897634.)/9.))

float rand(vec2 co)
{
    return atan(co.x-cos(co.y), co.y-sin(co.x))+2.32323232323232323232323*fract(sin(-time+sin(dot(co.yx ,vec2(12.9898+sin(5982.2958-time*23.), 14.*sin(5982.2958/time*0.00033450003)-25278.233)))) * time+tan(fract(time*666.777))+0.657567);
}

float rand_line()
{
    vec2 pos = gl_FragCoord.xy / resolution.xy;
    pos.x /= mix(fract(pos.y*time)/cos(length(-time))+1000000.0, fract(pos.x*-time-sin(fract(0.0001029437523485*time+10004.235029))/cos(length(0.999*cos(0.0567*time))))/2342.0, cos(sin(time*0.23232323)));
pos.y /= mix(fract(pos.x*time)/cos(length(-ctime))+1000000.0, fract(pos.y*-time-sin(fract(0.0001029437523485*atime+10004.235029))/cos(length(0.999*cos(0.2567*time))))/2342.0, sin(cos(btime*0.23232323)));
    float r = fract(666.9992323666-fract(666.*-time/time*0.0666))*cos(rand(mix(pos, mod(2.3*pos-1.3, tan(pos.y+cos(pos/ctime*0.00256234)-time*pos)), sin(0.023*pos.yx/-time*23.)+sin(time*0.0666))));
    
    if(r >= 0.112)
    {
	return r * sin(-r/atime)+rand( gl_FragCoord.yx / resolution.xy);
    }
    return 0.0;
}

void main( void ) {
 
    vec4 color;
    color -= mix(sin(cos(fract(6.6666-ctime*-0.230234)*2.3520325)/vec4(rand_line()))*0.6662323893666, vec4(rand_line())*0.5675, sin(0.1618330099116667*time));
    gl_FragColor = mix(0.666432*sin(color*0.232123144223777+fract(0.6664232323*sin(fract(-time*1.00043643663)))), 0.777*(color*0.232123144223777+(0.6664232323*sin(fract(-btime*1.00043643663)/(ctime*0.777)))), sin(atime*1.1618))-0.23777;

}