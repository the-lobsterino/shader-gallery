#extension GL_OES_standard_derivatives : enable
//GLSL color converter https://editor.p5js.org/setapolo/sketches/cLe_vriwo
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
       vec4 pixel;
	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
        pixel=vec4(0.9490196078431372, 0.17254901960784313,0.39215686274509803,1);
        //pixel=vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor =pixel;

}


