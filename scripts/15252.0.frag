#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// from https://glsl.heroku.com/e#15131.0
vec2 nearestHex(float s, vec2 st){
    float PI = 3.14159265359;
    float TAU = 2.0*PI;
    float deg30 = TAU/12.0;
    float h = sin(deg30)*s;
    float r = cos(deg30)*s;
    float b = s + 2.0*h;
    float a = 2.0*r;
    float m = h/r;

    vec2 sect = st/vec2(2.0*r, h+s);
    vec2 sectPxl = mod(st, vec2(2.0*r, h+s));
    
    float aSection = mod(floor(sect.y), 2.0);
    
    vec2 coord = floor(sect);
    if(aSection > 0.0){
        if(sectPxl.y < (h-sectPxl.x*m)){
            coord -= 1.0;
        }
        else if(sectPxl.y < (-h + sectPxl.x*m)){
            coord.y -= 1.0;
        }

    }
    else{
        if(sectPxl.x > r){
            if(sectPxl.y < (2.0*h - sectPxl.x * m)){
                coord.y -= 1.0;
            }
        }
        else{
            if(sectPxl.y < (sectPxl.x*m)){
                coord.y -= 1.0;
            }
            else{
                coord.x -= 1.0;
            }
        }
    }
    
    float xoff = mod(coord.y, 2.0)*r;
    return vec2(coord.x*2.0*r-xoff, coord.y*(h+s))+vec2(r*2.0, s);
}

void main( void ) {

    //vec2 position = ( gl_FragCoord.xy / resolution.xy );
    vec2 position = nearestHex(10.0, gl_FragCoord.xy)/resolution.xy;
    
    //vec3 col = vec3(0.5+0.5*sin(25.0*length(position-0.5)));
    //col.r += 0.5 + 0.5*sin(0.8/distance(mouse,position));
    //col.g += 0.5 + 0.5*sin(0.7/distance(mouse,position));
    //col.b += 0.5 + 0.5*sin(0.5/distance(mouse,position));
    //col = smoothstep(vec3(0.5,0.4,0.3),vec3(0.6,1.0,0.4),col);

    //vec2 position = ( gl_FragCoord.xy / resolution.xy );
    vec3 light = vec3(pow(1.0-abs(position.y+cos(position.x*8.0+(time*1.0))/10.0-0.75),50.0),
                      pow(1.0-abs(position.y+cos(position.x*4.0+(time*10.0))/10.0-0.5),50.0),
                      pow(1.0-abs(position.y+cos(position.x*8.0+(time*1.0))/10.0-0.25),50.0));
    light += pow(light.r+light.g+light.b,0.7);
    light *= vec3(0.5, 0.5, 1.5);
	
    vec3 col = light;
    //gl_FragColor = vec4( light.r,light.g,light.b, 10.0 );
	
    gl_FragColor = vec4(col, 1.0);
}