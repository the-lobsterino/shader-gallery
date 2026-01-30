#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec4 FetchCoeff(in float fPixelR, in vec2 v2Depth, in float fPixelLine, in vec2 v2SampleScanLine, in vec2 v2DisInvSampleLine)
{
	vec4 v4SampleCoeff = vec4(0.0, 0.0, -1.0, -1.0);
	
	if(fPixelR >= v2Depth.x && fPixelR <= v2Depth.y && fPixelLine >= 0.0 && fPixelLine <= (v2SampleScanLine.y -1.0))
	{
		float fPixelSample = (fPixelR - v2Depth.x) * v2DisInvSampleLine.x;
		int iPixelSampleFloor = int(fPixelSample);
		int iPixelLineFloor = int(fPixelLine);
		if(float(iPixelSampleFloor)<=(v2SampleScanLine.x -2.0) && float(iPixelLineFloor)<=(v2SampleScanLine.y-2.0))
		{
			float fU = float(iPixelSampleFloor)/v2SampleScanLine.x;
			float fV = float(iPixelLineFloor)/v2SampleScanLine.y;
			v4SampleCoeff = vec4(fU, fV, fPixelSample-float(iPixelSampleFloor), fPixelLine-float(iPixelLineFloor));
		}
	}
	
	return (v4SampleCoeff);
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 1.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 0.5 );

}