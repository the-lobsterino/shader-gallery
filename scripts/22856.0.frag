#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 );
}

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution.yy;

	float numTiles = 8.0;
	
	vec2 curretTile = floor(pos * numTiles);
	pos = fract(pos * numTiles) + 1.0;
	
	float minDist = 2.0;
	
	for(float y = -1.0; y < 2.0; y++) {

		for(float x = -1.0; x < 2.0; x++) {
			float po = rand( vec2(curretTile.x + x, curretTile.y + y) );
			
			vec2 point = vec2( (1.0 + x) + po , (1.0 + y) + (1.0 - po) );
			
			float dist = distance(pos, point);
			
			if(minDist > dist) minDist = dist;
		}

	}
	
	
	gl_FragColor = vec4(1.0 - minDist, 0, 0, 1);
}