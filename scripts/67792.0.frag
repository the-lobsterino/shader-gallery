#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform vec2 resolution;
uniform float time;

const int AMOUNT = 10 ;

void main(void){
    vec2 coord = 70.0*(gl_FragCoord.xy/ resolution );

    float len;

    for(int i = 0; i < AMOUNT;i++){
    
        len = length(vec2(coord.x,coord.y));

        coord.x = coord.x +sin(coord.y*coord.y + cos(len)) * sin(2.0);
        coord.y = fract(coord.y*coord.y + cos(coord.x*coord.x + sin(len)) * cos(time / 20.0));
    }

    //gl_FragColor = vec4(cos(len*2.0),cos(len),cos(len),1.0);
    gl_FragColor = vec4(abs(cos(len*sin(2.0+time))),sin(len*2.0-time*1.0),cos(len*1.39*sin(time*1.0)),0.9);
}
//twobitvision}