#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

const float ZOOM = 150.0;
const int TIMES = 10;
const float SPEED = 50.0;

void main( void ) {

	vec2 pos = (gl_FragCoord.xy) / ZOOM;
        float dist = distance(pos.x, pos.y);
	
    
    
        for(int i = 0; i < 10; i++) {
            dist = distance(pos.x, pos.y);

            pos.x = pos.x + sin(pos.y - sin(dist*0.5)) + cos(time/SPEED);
            pos.y = pos.y - cos(pos.x - cos(dist*0.1)) + sin(time/SPEED);
        }

    gl_FragColor = vec4(cos(pos.x*0.2),cos(pos.x*0.5),sin(pos.x*0.1), 1.0);

}