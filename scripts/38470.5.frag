//  Modded By Dennis Hjorth // @dennishjorth on twitter. 

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p, float fx, float fy, float ax, float ay) {
    vec2 r = vec2(p.x + sin(3.1415*cos(time * fx)) * ax, p.y + sin(3.1415*sin(time * fy)) * ay);	
    float color = 0.09/length(r);
    color = color > 1.0 ? 1.0 : color;
    color = color*0.2;
    return color;
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;	
    p.x	*= resolution.x / resolution.y;

    float col1 = 0.0 ,col2 = 0.0, col3 = 0.0;
    col1 += ball(p, 1.0*0.1, 2.0*0.1, 0.1, 0.2);
    col1 += ball(p, 1.5*0.1, 2.5*0.1, 0.5, 0.3);
    col1 += ball(p, 2.0*0.1, 3.0*0.1, 0.3, 0.4);
    col1 += ball(p, 2.5*0.1, 3.5*0.1, 0.4, 0.5);

    col2 += ball(p, 0.5*0.1, 3.1*0.1, 1.3, 0.9);
    col2 += ball(p, 1.0*0.1, 3.3*0.1, 1.1, 0.1);
    col2 += ball(p, 1.0*0.1, 1.0*0.1, 1.0, 0.5);	
    col2 += ball(p, 3.5*0.1, 3.5*0.1, 0.7, 0.9);

    col3 += ball(p, 2.5*0.1, 1.1*0.1, 1.3, 0.6);
    col3 += ball(p, 3.0*0.1, 2.3*0.1, 1.1, 0.3);
    col3 += ball(p, 3.0*0.1, 3.0*0.1, 1.0, 0.6);	
    col3 += ball(p, 2.5*0.1, 2.5*0.1, 0.7, 0.4);
	
    float multiplier = 4.8;
    col1 *= multiplier;
    col2 *= multiplier;
    col3 *= multiplier;
	
    float spec = 6.0;
    col1 = pow(col1,spec);
    col1 = col1 > 1.0 ? 1.0 : col1;
    col1 = col1 < 0.0 ? 0.0 : col1;
    col2 = pow(col2,spec);
    col2 = col2 > 1.0 ? 1.0 : col2;
    col2 = col2 < 0.0 ? 0.0 : col2;
    col3 = pow(col3,spec);
    col3 = col3 > 1.0 ? 1.0 : col3;
    col3 = col3 < 0.0 ? 0.0 : col3;

    float r,g,b,r2,g2,b2,r3,g3,b3;
	
    float heavy = 9.0;
    float light = 3.0;

    b = col1 * cos(col1) * light;
    g = col1 * cos(col1) * heavy; 
    r = col1 * cos(col1) * light;

    r2 = col2 * cos(col2) * light;
    g2 = col2 * cos(col2) * light;
    b2 = col2 * cos(col2) * heavy; 
	
    r3 = col3 * cos(col3) * heavy;
    g3 = col3 * cos(col3) * light;
    b3 = col3 * cos(col3) * light;
	
    r = r + r2 + r3;
    g = g + g2 + g3;
    b = b + b2 + b3;	

    gl_FragColor = vec4(r, g, b, 1.0);
}