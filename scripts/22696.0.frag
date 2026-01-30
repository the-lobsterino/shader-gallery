// Yin Yang Fire
// trying to replicate this  http://www.conwaylife.com/forums/viewtopic.php?f=11&t=1527

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
    vec2 position = (gl_FragCoord.xy/resolution.xy);
    float pw = 1.0/resolution.x; //pixel width
    float ph = 1.0/resolution.y; //pixel height
    
    float numstates=64.0;

    if (length(position-mouse) < 0.05) {
        //random circle of pixels around mouse position
        float rnd1 = mod(fract(sin(dot(position + time * 0.001, vec2(14.9898,78.233))) * 43758.5453), 1.0);
        gl_FragColor = vec4(rnd1);
    } else {
        //center pixel
        vec4 C = texture2D( backbuffer, position );
        //red channel holds cell state
        float result = C.r*numstates;
        float me = C.r*numstates;
        //add up neighbours        
        vec4 E = texture2D( backbuffer, vec2(position.x + pw, position.y) );
        vec4 N = texture2D( backbuffer, vec2(position.x, position.y + ph) );
        vec4 W = texture2D( backbuffer, vec2(position.x - pw, position.y) );
        vec4 S = texture2D( backbuffer, vec2(position.x, position.y - ph) );
        vec4 NE = texture2D( backbuffer, vec2(position.x + pw, position.y + ph) );
        vec4 NW = texture2D( backbuffer, vec2(position.x - pw, position.y + ph) );
        vec4 SE = texture2D( backbuffer, vec2(position.x + pw, position.y - ph) );
        vec4 SW = texture2D( backbuffer, vec2(position.x - pw, position.y - ph) );
        float count = (E.r+N.r+W.r+S.r+NE.r+NW.r+SE.r+SW.r)*numstates;
        //update cell        
        if (me*8.+2.>=count) {
            result=result-1.0;
            if (result<0.0) { result=numstates-1.0; }
        } else {
            result=me+1.0;
        }

        gl_FragColor=vec4(result/numstates,result/numstates,result/numstates,1.0);
        
    }
}
