e_list={}
graph={}
me=1000
games=0

function create_entity()
 e={}
 e_list[#e_list+1]=e
 return e
end

function draw_graph()
 p={}
 vmin=9999
 vmax=-9999
 for i=1,#graph,1 do
  v=graph[i]
  if v<vmin then vmin=v
  elseif v>vmax then vmax=v end
 end
 vmin=flr(vmin)
 vmax=flr(vmax)
 range=vmax-vmin
 height=64
 s=height/range
 
 c1=1
 line(0,127,127,127,c1)
 line(0,127-height,127,127-height,c1)
 line(0,127-height/2,127,127-height/2,c1)

 print(vmax,64,120-height,c1)
 print(vmin+flr(range/2),64,120-height/2,c1)
 print(vmin,64,120,c1)
 print("rating swing="..range,0,0,2)
 for i=1,#graph-1,1 do
  p1=graph[i]-vmin
  p2=graph[i+1]-vmin
  if p2>p1 then c2=11
  else c2=8 end 
  line(i,128-p1*s,i+1,128-p2*s,c2)
 end
 
 
end

function _setup()
 create_entity()
end

function _draw()
	cls(0)
	
	draw_graph()
	
	
 print ("games: "..games,0,10,4) 
 print ("current rating: "..me,0,20,5)
end

function newrating(
	myrating, 
	opprating)
    -- constants for the elo calculation
    local k = 20  
    local e = 1 / (1 + 10^((opprating - myrating) / 400))
    local p_me = 1 / (1 + 10^((opprating - 2000) / 400))
    
    -- calculate the change in rating
    local result
    if rnd(1)<p_me then result=1 
    else result=0 end    
    local ratingchange = k * (result - e)

    -- calculate the new rating
    local newrating = myrating + ratingchange


    return flr(newrating + 0.5)  
end

function _update()
 opp=rnd(400)-200+me 
 me=newrating(me,opp)
 games=games+1
 rating=me
 ofs=0 
 if #graph < 128 then
  ofs=1
 else
  for i=1,#graph-1,1 do
   graph[i]=graph[i+1]
  end
 end
 graph[#graph+ofs]=rating
end
