<?php
$servername = "localhost";
$username   = "root";
$password   = "root";
$dbname     = "test";
$conn = mysqli_connect($servername, $username, $password, $dbname) or die("Connection failed: " . mysqli_connect_error());
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

// Source type : json / html
$sourceType = $_REQUEST['sourceType'];

if( $sourceType == 'html' )
{
    $getParentNodes = "select id, name from permissions where inherit_id IS NULL";
    $resParentNodes = mysqli_query($conn, $getParentNodes);
    $response = '';
    if(mysqli_num_rows($resParentNodes) > 0)
    {
        while($parentNode = mysqli_fetch_assoc($resParentNodes))
        {
            $response .= '<ul  class="jtree_parent_node">
                <li>
                    <span class="jtree_expand jtree_node_open"> </span>
                    <label><input type="checkbox" id="'. $parentNode['id'] .'" parent-id="" class="jtree_parent_checkbox"> '. $parentNode['name'] .'</label>';

                    $getChildNodes = "select id, name from permissions where inherit_id = '".$parentNode['id']."'";
                    $resChildNodes = mysqli_query($conn, $getChildNodes);
                    if(mysqli_num_rows($resChildNodes) > 0)
                    {
                        $response .= '<ul class="jtree_child_node">';
                        while($childNode = mysqli_fetch_assoc($resChildNodes))
                        {
                            $response .= '
                                <li><label><input type="checkbox" id="'. $childNode['id'] .'" parent-id="'. $parentNode['id'] .'" class="jtree_child_checkbox"> '. $childNode['name'] .'</label></li>
                            ';
                        }
                        $response .= '</ul>';
                    }
                    
            $response .= '</li>
            </ul>';     
        }
    }

    echo $response;
}
else
{
    $response   = array();
    $childNodes = array();

    $getParentNodes = "select id, name from permissions where inherit_id IS NULL";
    $resParentNodes = mysqli_query($conn, $getParentNodes);
    $response = '';
    if(mysqli_num_rows($resParentNodes) > 0)
    {
        while($parentNode = mysqli_fetch_assoc($resParentNodes))
        {
            $getChildNodes = "select id, name from permissions where inherit_id = '".$parentNode['id']."'";
            $resChildNodes = mysqli_query($conn, $getChildNodes);
            if(mysqli_num_rows($resChildNodes) > 0)
            {
                while($childNode = mysqli_fetch_assoc($resChildNodes))
                {
                    $childNodes[] = $childNode;
                }

                $response[$parentNode['id']] = array(
                    'parentNodeId'  => $parentNode['id'],
                    'parentNodeTxt' => $parentNode['name'],
                    'childNodes'    => $childNodes
                );
            }
        }
    }

    echo json_encode( $response );
}


?>