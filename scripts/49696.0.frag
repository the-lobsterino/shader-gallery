#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


bool IsBlast(vec2 pos, vec2 target, vec2 source, float startWidth, float endWidth, float height)
{
	float dx = pos.x - target.x;
	float dy = pos.y - target.y;
	
	if(dy < 0.0 || dy > height)
		return false;
	
	float interpolPerDy = (endWidth - startWidth) / height;
	float currentWidthRespectiveToDY = startWidth + dy * interpolPerDy;
	if(abs(dx) > currentWidthRespectiveToDY)
		return false;
	
	return true;
}

bool IsLine(vec2 pos, vec2 target, vec2 source, float width, float height)
{
	float dx = pos.x - target.x;
	float dy = pos.y - target.y;
	return abs(dx) < width/2.0 && dy > 0.0 && dy < height;
}

bool IsBurst(vec2 pos, vec2 target, vec2 source, float sqRadius)
{
	float dx = pos.x - target.x;
	float dy = pos.y - target.y;
	return dx*dx + dy*dy < sqRadius;
}

void DrawSelection()
{
	vec2 currentPos = gl_FragCoord.xy;
	vec2 targetPos = vec2(300, 300);
	vec2 sourcePos = vec2(400, 400);
	
	vec4 standardColor = vec4(1, 1, 1, 1);
	vec4 selectedColor = vec4(1, 0, 0, 1);
	
	float dx = currentPos.x - targetPos.x;
	float dy = currentPos.y - targetPos.y;
	
	/*if(IsBlast(currentPos, targetPos, sourcePos, 50.0, 100.0, 50.0))
		gl_FragColor = selectedColor;
	else
		gl_FragColor = standardColor;*/
	
	/*if(IsLine(currentPos, targetPos, sourcePos, 50.0, 100.0))
		gl_FragColor = selectedColor;
	else
		gl_FragColor = standardColor;*/
	
	if(IsBurst(currentPos, targetPos, sourcePos, 625.0)) //25 radius = 625 sq radius (25*25)
		gl_FragColor = selectedColor;
	else
		gl_FragColor = standardColor;
}

void main( void ) {

	DrawSelection();
	return;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}