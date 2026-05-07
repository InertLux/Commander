import cytoscape from "/lib/cytoscape/cytoscape.esm.min.mjs";

const data = {
    nodes: [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
        { id: "4", name: "Diana" }
    ],
    relationships: [
        { from: "1", to: "2", type: "love", strength: 8 },
        { from: "1", to: "3", type: "hate", strength: 4 },
        { from: "2", to: "4", type: "home", strength: 6 }
    ]
};

let selectedNode = null;

function iconForType(type) {
    return {
        love: "❤️",
        hate: "🗡️",
        home: "🏠"
    }[type] || "❓";
}

const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: [],
    style: [
        {
            selector: "node",
            style: {
                "label": "data(name)",
                "background-color": "#8ec6ff",
                "border-width": 2,
                "border-color": "#2a6fb0",
                "text-valign": "center",
                "text-halign": "center"
            }
        },
        {
            selector: "edge",
            style: {
                "curve-style": "bezier",
                "width": 3,
                "line-color": "#555",
                "target-arrow-shape": "triangle",
                "target-arrow-color": "#555",
                "label": "data(label)",
                "font-size": 12,
                "text-background-color": "#fff",
                "text-background-opacity": 1,
                "text-background-padding": 2
            }
        }
    ],
    layout: { name: "circle" }
});

// Load nodes
cy.add(data.nodes.map(n => ({
    data: { id: n.id, name: n.name }
})));

// Load edges
cy.add(data.relationships.map(r => ({
    data: {
        id: `${r.from}-${r.to}`,
        source: r.from,
        target: r.to,
        type: r.type,
        strength: r.strength,
        label: iconForType(r.type) + " " + r.strength
    }
})));

cy.layout({ name: "circle" }).run();

/* -------------------------
   UI BINDINGS
-------------------------- */

const nodeList = document.getElementById("nodeList");
const targetNode = document.getElementById("targetNode");
const relationshipList = document.getElementById("relationshipList");

data.nodes.forEach(n => {
    const div = document.createElement("div");
    div.textContent = n.name;
    div.style.cursor = "pointer";
    div.onclick = () => selectNode(n.id);
    nodeList.appendChild(div);

    const opt = document.createElement("option");
    opt.value = n.id;
    opt.textContent = n.name;
    targetNode.appendChild(opt);
});

function selectNode(id) {
    selectedNode = id;
    cy.elements().removeClass("highlight");
    cy.getElementById(id).addClass("highlight");
    showRelationships();
}

function showRelationships() {
    relationshipList.innerHTML = "";

    const rels = data.relationships.filter(r => r.from === selectedNode);

    rels.forEach((r, index) => {
        const div = document.createElement("div");
        div.className = "relationship-item";

        div.innerHTML = `
            <strong>${iconForType(r.type)} → ${nodeName(r.to)}</strong><br>
            Strength: <input type="number" min="1" max="10" value="${r.strength}"
                data-index="${index}" class="strengthInput">
        `;

        relationshipList.appendChild(div);
    });

    document.querySelectorAll(".strengthInput").forEach(input => {
        input.onchange = () => {
            const index = input.dataset.index;
            updateStrength(index, input.value);
        };
    });
}

function nodeName(id) {
    return data.nodes.find(n => n.id === id).name;
}

function updateStrength(index, value) {
    const rels = data.relationships.filter(r => r.from === selectedNode);
    rels[index].strength = Number(value);

    const r = rels[index];
    const edge = cy.getElementById(`${r.from}-${r.to}`);
    edge.data("strength", r.strength);
    edge.data("label", iconForType(r.type) + " " + r.strength);
}

document.getElementById("addRelBtn").onclick = () => {
    if (!selectedNode) return alert("Select a node first");

    const to = targetNode.value;
    const type = document.getElementById("relType").value;
    const strength = Number(document.getElementById("relStrength").value);

    const rel = { from: selectedNode, to, type, strength };
    data.relationships.push(rel);

    cy.add({
        data: {
            id: `${rel.from}-${rel.to}`,
            source: rel.from,
            target: rel.to,
            type,
            strength,
            label: iconForType(type) + " " + strength
        }
    });

    showRelationships();
};
