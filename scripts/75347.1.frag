 #extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 spectrum;

/*
If someone has another magical function which produces patterns like this one pls add ...

>>> Thank You i have spent so much time with this shader!!! 
drop it into Kodelife by hexler.net it is audio responsive
”(((DARKEST PASSENGER)))”<<<
iG:@crackhausen93 

*/
 float t = time + float (sin(spectrum.xyz));
float field21(in vec3 p, float s) {
    float strength = 7.+ .03 * log(1.e-6 + fract(sin(time*10.) * 666.0)*mouse.y);
    float accum = s*3.;
    float prev = 0.*mouse.x;
    float tw = 0.;
    for (int i = 0; i < 12; ++i) {
        
        float mag = dot(p,p)*pow(s,1.0*abs(sin(time/100.0)));
        //remove comment for another effect
        mag*=dot(p,1.03/p);
        p = abs(p) / mag + vec3(-.9*smoothstep(8./mouse.x,1.-mouse.y,13.), -.34560*abs(sin(time/12.-clamp(mouse.x,-mouse.y,-sin(time/15.)))), -1.+mouse.y);
        float w = exp(-float(i) / 9.);
        accum += w *exp(-strength * pow(abs(mag / prev),1.2));
        tw += w*w;
        prev = mag;
    }
    return max(0.,4. * accum / tw - .692);
}


void main( void ) {

    vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
    pos.x*=resolution.x/resolution.y;
    //pos /= 3.;
    
    time + t+ 1. ;
    
    float col=0.4;
    
    col=field21(vec3(pos,sin(spectrum.y-(time*.25))), .32325);
    
    //col=0.2;
    
    vec3 color=vec3(col);
    
    
    
    
    gl_FragColor=vec4(1.-color,.9909);

}