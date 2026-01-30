#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	
	//===================================================================================
	// 一番下の列からデータを取得する
	//===================================================================================
	int state = int(texture2D(backbuffer, vec2(0, 0)).r * 256.0);
	
	
	//===================================================================================
	// 一番下の列のピクセルなら、データの更新を行う
	//===================================================================================
	if (int(gl_FragCoord.y) == 0)
	{
		if (int(gl_FragCoord.x) == 0)
		{
		}
		gl_FragColor = vec4(3.0 / 256.0, 0, 0, 1);
		return;
	}
	
	//===================================================================================
	// それ以外なら、描画を行う
	//===================================================================================
	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	// texture2D(backbuffer, gl_FragCoord.xy)
	if (state == 3)
		gl_FragColor = vec4(1, 0.5, 0.5, 1);
	else gl_FragColor = vec4(0, 0, 0, 1);
	//gl_FragColor = vec4( (vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ) + texture2D(backbuffer, gl_FragCoord.xy).rgb) * 0.5, 1.0 );
}