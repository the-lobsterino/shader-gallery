#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;		//時間
uniform vec2 mouse;		//マウス
uniform vec2 resolution;	//画面サイズ

//円
bool inCircle(vec2 position, vec2 offset, float size) 
{
    float len = length(position - offset);
    if (len < size)
    {
        return true;
    }
    return false;
}
//四角
bool inRect(vec2 position, vec2 offset, float size) 
{
    vec2 q = (position - offset) / size;
    if (abs(q.x) < 1.0 && abs(q.y) < 1.0) {
        return true;
    }
    return false;
}
//
bool inTriangle(vec2 position, vec2 offset, float size) 
{
     float len = length(position - offset);
    if (len < size)
    {
	    if(position.y > offset.y - size/2.0)
	    {	    
		    if(position.x < offset.x && position.x > offset.x - length(position - vec2(offset.x,offset.y + size)) * sin(radians(30.0)) ||
		       position.x > offset.x && position.x < offset.x + length(position - vec2(offset.x,offset.y + size)) * sin(radians(30.0)))
		    {
		     return true;
		    }
	    }
    }

    return false;
}

bool inHexagon(vec2 position, vec2 offset, float size) 
{
     float len = length(position - offset);
    if (len < size)
    {
	    float one = abs((size + size * 0.5) * tan(radians(30.0)));
	    if(position.x > offset.x - one && position.x < offset.x + one)
	    {	    
		    if(position.x < offset.x && position.x > offset.x - length(position - vec2(offset.x,offset.y + size)) * sin(radians(60.0)) &&
		       position.x < offset.x && position.x > offset.x - length(position - vec2(offset.x,offset.y - size)) * sin(radians(60.0)) ||
		       position.x > offset.x && position.x < offset.x + length(position - vec2(offset.x,offset.y + size)) * sin(radians(60.0)) &&
		       position.x > offset.x && position.x < offset.x + length(position - vec2(offset.x,offset.y - size)) * sin(radians(60.0))
		      )
		    {
		     return true;
		    }
	    }
    }

    return false;
}

void main( void ) 
{
	vec2 mou = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);
	vec2 position =(gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
 	vec3 destColor = vec3(0,0,0);
	
	// positionが円の中に入っているか？
	if (inCircle (position, vec2(-0.2,-0.2), 0.4)) 
	{
        	destColor += vec3(1.0,0,0);
  	}
	
	if (inRect (position, vec2(-0.2,0.2), 0.4)) 
	{
	//	destColor = vec3(0,0,0);
        	destColor += vec3(0,1.0,0);
  	}
	if (inTriangle (position, vec2(0.2,-0.2), 0.4)) 
	{
	//	destColor = vec3(0,0,0);
        	destColor += vec3(0,0,1.0);
  	}
	if (inHexagon (position, vec2(0.2,0.2), 0.4)) 
	{
	//	destColor = vec3(0,0,0);
        	destColor += vec3(0.5,0,0.5);
  	}
	
	// 最終的に得られた色を出力
	gl_FragColor = vec4(destColor, 1.0);
}