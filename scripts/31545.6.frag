#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

void main(void){
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;

    float color = 0.0;
	color += sin( position.x * sin( time / 15.0 ) * 80.0 ) + sin( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * cos( time / 20.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + cos( position.y * sin( time / 50.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.4;

	gl_FragColor = vec4( vec3( color*0.2, color * 0.2+sin(time / 5.0 )*0.4+0.2, sin( color + time / 30.0 ) * 0.2 +0.2), 1.0 );
    }
