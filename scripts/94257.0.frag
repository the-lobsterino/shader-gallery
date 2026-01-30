#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main( void ) {
	vec4 color = texture2D(uSampler, vTextureCoord);
	float worldX = gl_FragCoord.x;
	float worldY = gl_FragCoord.y;
	float cellSize = 36.;
		
	float x = worldX - (floor(worldX / cellSize)) * cellSize;
	float y = worldY - (floor(worldY / (cellSize * 1.73))) * 1.73;
	gl_FragColor = vec4(0.,0.,0.,0.);
}